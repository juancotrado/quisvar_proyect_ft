import { useCallback, useEffect, useState } from 'react';
import './group.css';
import { axiosInstance } from '../../services/axiosInstance';
import { Group as GroupData } from '../../types';
import { Outlet } from 'react-router-dom';
import { GroupBtnAdd, GroupListBar, GroupMeetingBar } from './components';
import { Button } from '../../components';

export const Group = () => {
  const [groups, setGroups] = useState<GroupData[]>();
  const [add, setAdd] = useState<boolean>(false);
  const getgroups = useCallback(async () => {
    await axiosInstance.get('/groups/all').then(res => setGroups(res.data));
  }, []);

  useEffect(() => {
    getgroups();
  }, [getgroups]);

  return (
    <div className="gr-container">
      <section className="gr-list">
        <h1 className="gr-title">REUNIONES</h1>
        <GroupMeetingBar />
        <h1 className="gr-title">GRUPOS</h1>
        {groups &&
          groups.map((group, _index) => (
            <GroupListBar group={group} key={group.id} onSave={getgroups} />
          ))}
        {!add ? (
          <Button
            text="Agregar"
            icon="plus"
            className="gr-btn-add"
            onClick={() => setAdd(true)}
          />
        ) : (
          <GroupBtnAdd setBtnActive={() => setAdd(!add)} onSave={getgroups} />
        )}
      </section>
      <section className="gr-content">
        <Outlet />
      </section>
    </div>
  );
};
