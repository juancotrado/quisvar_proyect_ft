import { useCallback, useEffect, useMemo, useState } from 'react';
import './group.css';
import { axiosInstance } from '../../services/axiosInstance';
import { Group as GroupData } from '../../types';
import { Outlet } from 'react-router-dom';
import { GroupBtnAdd, GroupListBar, GroupMeetingBar } from './components';
import { Aside, Button, CustomSwitch } from '../../components';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { navItemsMeetings, navItemsReports } from './models';

export const Group = () => {
  const [groups, setGroups] = useState<GroupData[]>();
  const [initial, setInitial] = useState<GroupData[]>();
  const itemsId = useMemo(() => groups?.map(item => item.id), [groups]);
  const [activeElem, setActiveElem] = useState<GroupData | null>(null);
  const [add, setAdd] = useState<boolean>(false);
  // const [isSwitched, setIsSwitched] = useState<boolean>(false);
  const [editOrder, setEditOrder] = useState<boolean>(false);
  const getgroups = useCallback(() => {
    axiosInstance.get<GroupData[]>('/groups/all').then(res => {
      setGroups(res.data);
      setInitial(res.data);
    });
  }, []);

  useEffect(() => {
    getgroups();
  }, []);

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
    if (groups === initial) return;
    const data = groups?.map(({ id }) => ({ id }));
    axiosInstance.put('/groups/order', data).then(() => {
      getgroups();
    });
  };
  const handleChange = () => {
    if (editOrder) {
      handleOrder();
    }
  };
  return (
    <div className="gr-container">
      <Aside>
        <h1 className="gr-title">REUNIONES</h1>
        <GroupMeetingBar itemOptions={navItemsMeetings} />
        <h1 className="gr-title">REPORTES</h1>
        <GroupMeetingBar itemOptions={navItemsReports} />
        <div className="gr-toggle-area">
          <h1 className="gr-title">GRUPOS</h1>
          {!add && (
            <CustomSwitch
              isToggle={editOrder}
              onToggle={handleChange}
              onClick={() => setEditOrder(!editOrder)}
              disabled={add}
            />
          )}
        </div>
        <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <div className="gr-drag-content">
            <SortableContext
              items={itemsId ? itemsId : []}
              disabled={!editOrder}
            >
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
          </div>
          {createPortal(
            <DragOverlay>
              {activeElem && <GroupListBar group={activeElem} />}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
        {!add ? (
          <Button
            text="Agregar"
            icon="plus"
            variant="outline"
            position="center"
            onClick={() => setAdd(true)}
            disabled={editOrder}
          />
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
