import { useCallback, useEffect, useState } from 'react';
import './group.css';
import { axiosInstance } from '../../services/axiosInstance';
import { Group as GroupData } from '../../types';
import { Outlet } from 'react-router-dom';
import { GroupBtnAdd, GroupListBar, GroupMeetingBar } from './components';
import { Aside, Button } from '../../components';
import { DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
// type Ids = {
//   id: number;
// };
export const Group = () => {
  const [groups, setGroups] = useState<GroupData[]>();
  const [itemsId, setItemsId] = useState<number[]>();
  const [add, setAdd] = useState<boolean>(false);
  const [editOrder, _] = useState<boolean>(false);
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
  return (
    <div className="gr-container">
      <Aside>
        <h1 className="gr-title">REUNIONES</h1>
        <GroupMeetingBar />
        <h1 className="gr-title">GRUPOS</h1>
        <DndContext>
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
        </DndContext>
        {!add ? (
          <>
            {/* <button type="button" onClick={() => setEditOrder(true)}>
              editar
            </button>
            <button onClick={() => setEditOrder(false)}>cancelar</button> */}
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
