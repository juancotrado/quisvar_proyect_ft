import { useEffect, useState } from 'react';
import './userList.css';
import { CardRegisterUser } from '../../components';
import Button from '../../components/shared/button/Button';
import { axiosInstance } from '../../services/axiosInstance';
import { isOpenModal$ } from '../../services/sharingSubject';
import { User } from '../../types/types';
import UserInfo from '../../components/users/UserInfo';

const UserList = () => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    await axiosInstance.get('/users').then(res => {
      setUsers(res.data);
    });
  };

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
          <h1>LISTA DE USUARIOS</h1>
          <div>
            <Button
              text="Agregar"
              icon="plus"
              className="btn-add"
              onClick={addUser}
            />
          </div>
        </div>
        <div className="user-container-list">
          {users &&
            users.map(user => (
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
        onSave={() => {
          getUsers();
          setUserData(null);
        }}
      />
    </div>
  );
};

export default UserList;
