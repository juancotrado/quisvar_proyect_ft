import { useEffect, useMemo, useState } from 'react';
import './userList.css';
import { CardRegisterUser } from '../../components';
import Button from '../../components/shared/button/Button';
import { axiosInstance } from '../../services/axiosInstance';
import { isOpenModal$ } from '../../services/sharingSubject';
import { User } from '../../types/types';
import UserInfo from '../../components/users/UserInfo';

const UsersList = () => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [isArchived, setIsArchived] = useState(true);
  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    await axiosInstance.get('/users').then(res => {
      setUsers(res.data);
    });
  };
  const filterList = useMemo(
    () => (users ? users?.filter(user => user.status === isArchived) : []),
    [isArchived, users]
  );

  const addUser = () => {
    setUserData(null);
    isOpenModal$.setSubject = true;
  };
  const editUser = (value: User) => {
    isOpenModal$.setSubject = true;
    setUserData(value);
  };

  return (
    <div className="content-list">
      <div className="user-list">
        <div className="list-title">
          <h1 className="main-title">
            LISTA DE <span className="main-title-span">USUARIOS </span>
          </h1>
          <div>
            <Button
              text="Agregar"
              icon="plus"
              className="btn-add"
              onClick={addUser}
            />
          </div>
        </div>
        <div className="list-filter">
          <Button
            text={`${isArchived ? 'Ver archivados' : 'Ver en actividad'}`}
            className={`${
              isArchived ? 'btn-filter-unavailable' : 'btn-filter-available'
            }`}
            onClick={() => setIsArchived(!isArchived)}
          />
        </div>
        <div className="header-container-list">
          <div className="header-list-user">USUARIO</div>
          <div className="header-list-role">ROL DE TRABAJO</div>
          <div className="header-list-status">ESTADO</div>
          <div className="header-list-dni">CARGO</div>
          <div className="header-list-phone">CELULAR</div>
          <div className="header-list-edit">EDITAR</div>
        </div>
        <div className="user-container-list">
          {filterList.map(user => (
            <UserInfo
              key={user.id}
              user={user}
              onUpdateStatus={getUsers}
              onUpdate={() => editUser(user)}
              onDelete={() => getUsers()}
            />
          ))}
        </div>
      </div>
      <CardRegisterUser
        user={userData}
        onClose={() => {
          setUserData(null);
        }}
        onSave={() => {
          getUsers();
          setUserData(null);
        }}
      />
    </div>
  );
};

export default UsersList;
