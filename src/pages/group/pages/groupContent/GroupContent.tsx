import { useCallback, useEffect, useState } from 'react';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import { axiosInstance } from '../../../../services/axiosInstance';
import './groupContent.css';
import { Group } from '../../../../types';
import { isOpenCardAddGroup$ } from '../../../../services/sharingSubject';
import { Button, ButtonDelete } from '../../../../components';
import { CardAddGroup } from './views';

export const GroupContent = () => {
  const { groupId, name } = useParams();
  const [members, setMembers] = useState<Group>();
  const getUserGroup = useCallback(async () => {
    await axiosInstance
      .get(`/groups/${groupId}`)
      .then(res => setMembers(res.data));
  }, [groupId]);

  useEffect(() => {
    getUserGroup();
  }, [getUserGroup]);
  // const hasCoordinator = members?.groups?.find(
  //   member => member.users.role === 'MOD' || member.users.role === 'SUPER_MOD'
  // );
  const handleOpenCard = (id: number) => {
    isOpenCardAddGroup$.setSubject = {
      isOpen: true,
      id,
    };
  };
  return (
    <div className="grc-main">
      <div className="grc-header">
        <h1 className="grc-group-title">
          {name}: {members?.name}
        </h1>
        <div className="grc-options-container">
          <NavLink
            to={`proyectos/${groupId}`}
            className={({ isActive }) =>
              `grc-options  ${isActive && 'grc-selected'} `
            }
          >
            <h4>PROYECTOS</h4>
          </NavLink>
          <NavLink
            to={`reuniones/${groupId}`}
            className={({ isActive }) =>
              `grc-options  ${isActive && 'grc-selected'} `
            }
          >
            <h4>REUNIONES DIARIAS</h4>
          </NavLink>
          <NavLink
            to={`semanal/${groupId}`}
            className={({ isActive }) =>
              `grc-options  ${isActive && 'grc-selected'} `
            }
          >
            <h4>COMPROMISOS SEMANALES</h4>
          </NavLink>
        </div>
      </div>
      <div className="grc-body">
        <section className="grc-performance">
          <Outlet />
        </section>
        <section className="grc-list-users">
          <div className="grc-title-list">
            <h1 className="grc-title-name">INTEGRANTES</h1>
            <Button
              text="Agregar"
              icon="plus"
              className="grc-btn-add"
              onClick={() => groupId && handleOpenCard(+groupId)}
            />
          </div>
          <div className="grc-member-table">
            <div className="grc-list-header">
              <h1 className="grc-title-member">#</h1>
              <h1 className="grc-title-member">INTEGRANTE</h1>
              <h1 className="grc-title-member">USUARIO</h1>
              <h1 className="grc-title-member">Borrar</h1>
            </div>
            <div className="grc-list-members">
              <h1 className="grc-member-name">1</h1>
              <h1 className="grc-member-mod">
                {members?.modId
                  ? `${
                      members.moderator.profile.firstName +
                      ' ' +
                      members.moderator.profile.lastName
                    }`
                  : 'Sin coordinador'}
              </h1>
              <span className="ule-size-pc">
                <img src="/svg/pc-icon.svg" className="ule-icon-size" />
                {members?.modId ? members.moderator.profile.userPc : '---'}
              </span>
              {members?.modId && (
                <span className="ule-size-pc">
                  <ButtonDelete
                    icon="trash"
                    url={`/groups/mod/${groupId}`}
                    className="role-delete-icon"
                    onSave={getUserGroup}
                  />
                </span>
              )}
            </div>
            {members?.groups &&
              members.groups.map((member, index) => (
                <div className="grc-list-members" key={member?.users.id}>
                  <h1 className="grc-member-name">{index + 2}</h1>
                  <h1 className="grc-member-name">
                    {member.users.profile.firstName}{' '}
                    {member.users.profile.lastName}
                  </h1>
                  <span className="ule-size-pc">
                    <img src="/svg/pc-icon.svg" className="ule-icon-size" />
                    {member.users.profile.userPc ?? '---'}
                  </span>
                  <span className="ule-size-pc">
                    <ButtonDelete
                      icon="trash"
                      url={`/groups/relation/${member?.users.id}/${groupId}`}
                      className="role-delete-icon"
                      onSave={getUserGroup}
                    />
                  </span>
                </div>
              ))}
          </div>
        </section>
      </div>
      <CardAddGroup onSave={getUserGroup} modId={members?.modId} />
    </div>
  );
};

export default GroupContent;
