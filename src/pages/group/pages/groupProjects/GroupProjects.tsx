// import { Button } from '../../../../components';
import './groupProjects.css';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { useMemo, useState } from 'react';
import Items from './Items';
import { createPortal } from 'react-dom';
type Obj = {
  id: number;
  text: string;
};
const data = [
  { id: 1, text: 'elemento 1' },
  { id: 2, text: 'elemento 2' },
  { id: 3, text: 'elemento 3' },
  { id: 4, text: 'elemento 4' },
];

export const GroupProjects = () => {
  const [activeElem, setActiveElem] = useState<Obj | null>(null);
  const [values, setValues] = useState<Obj[]>(data);
  const itemsId = useMemo(() => values.map(item => item.id), [values]);
  const onDragStart = (event: DragStartEvent) => {
    console.log(event.active.data.current?.item);
    if (event.active.data.current?.type === 'Group')
      setActiveElem(event.active.data.current.item);
  };
  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeItem = active.id;
    const overItem = over.id;
    if (activeItem === overItem) return;
    setValues(values => {
      const activeItemIndex = values.findIndex(e => e.id === activeItem);
      const overItemIndex = values.findIndex(e => e.id === overItem);
      return arrayMove(values, activeItemIndex, overItemIndex);
    });
  };
  console.log(activeElem);
  return (
    <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="gp-content">
        <SortableContext items={itemsId}>
          {values && values.map(item => <Items item={item} key={item.id} />)}
        </SortableContext>
      </div>
      {createPortal(
        <DragOverlay>{activeElem && <Items item={activeElem} />}</DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};

export default GroupProjects;
