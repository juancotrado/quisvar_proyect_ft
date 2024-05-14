import { useCallback, useEffect, useState } from 'react';
import './group.css';
import { axiosInstance } from '../../services/axiosInstance';
import { Group as GroupData } from '../../types';
import { Outlet } from 'react-router-dom';
import { GroupBtnAdd, GroupListBar, GroupMeetingBar } from './components';
import { Aside, Button } from '../../components';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
// type Ids = {
//   id: number;
// };
export const Group = () => {
  const [groups, setGroups] = useState<GroupData[]>();
  const [itemsId, setItemsId] = useState<number[]>();
  const [activeElem, setActiveElem] = useState<GroupData | null>(null);
  const [add, setAdd] = useState<boolean>(false);
  const [editOrder, setEditOrder] = useState<boolean>(false);
  const getgroups = useCallback(() => {
    axiosInstance.get<GroupData[]>('/groups/all').then(res => {
      setGroups(res.data);
    });
  }, []);

  useEffect(() => {
    getgroups();
  }, [getgroups]);
  useEffect(() => {
    if (groups && groups.length > 0) {
      const items = groups.map(item => item.id);
      setItemsId(items);
    } else {
      setItemsId([]);
    }
  }, [groups]);

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Group')
      setActiveElem(event.active.data.current.group);
  };
  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeItem = active.id;
    const overItem = over.id;
    if (activeItem === overItem) return;
    setGroups(values => {
      if (!values) return [];
      const activeItemIndex = values?.findIndex(e => e.id === activeItem);
      const overItemIndex = values?.findIndex(e => e.id === overItem);
      return arrayMove(values, activeItemIndex, overItemIndex);
    });
  };
  const handleOrder = () => {
    const data = groups?.map(group => {
      return {
        id: group.id,
      };
    });
    axiosInstance.put('/groups/order', data).then(() => {
      getgroups();
      setEditOrder(false);
    });
  };
  return (
    <div className="gr-container">
      <Aside>
        <h1 className="gr-title">REUNIONES</h1>
        <GroupMeetingBar />
        <h1 className="gr-title">GRUPOS</h1>
        <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <SortableContext items={itemsId ? itemsId : []} disabled={!editOrder}>
            {groups &&
              groups.map((group, _index) => (
                <GroupListBar
                  group={group}
                  key={group.id}
                  onSave={getgroups}
                  editOrder={editOrder}
                />
              ))}
          </SortableContext>
          {createPortal(
            <DragOverlay>
              {activeElem && <GroupListBar group={activeElem} />}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
        {!add ? (
          <>
            {!editOrder ? (
              <Button
                type="button"
                onClick={() => setEditOrder(true)}
                text="Editar Orden"
              />
            ) : (
              <div className="gr-order">
                <Button onClick={() => setEditOrder(false)} text="Cancelar" />
                <Button onClick={handleOrder} text="Guardar" />
              </div>
            )}

            <Button
              text="Agregar"
              icon="plus"
              className="gr-btn-add"
              onClick={() => setAdd(true)}
            />
          </>
        ) : (
          <GroupBtnAdd
            setBtnActive={() => setAdd(!add)}
            onSave={getgroups}
            groupLength={groups?.length}
          />
        )}
      </Aside>

      <section className="gr-content">
        <Outlet />
      </section>
    </div>
  );
};
