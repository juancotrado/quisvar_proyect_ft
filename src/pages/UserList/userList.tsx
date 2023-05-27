import { useEffect, useState } from 'react';
import './userList.css';
import { CardRegisterUser, UserDetail } from '../../components';
import Button from '../../components/shared/button/Button';
import { axiosInstance } from '../../services/axiosInstance';
import { isOpenModal$ } from '../../services/sharingSubject';
import { Users } from '../../types/types';
import UserInfo from '../../components/users/UserInfo';
// interface CreateUsers {
//   id: number;
//   email: string;
//   password: string;
//   firstName: string;
//   lastName: string;
//   dni: string;
//   phone: string;
//   workAreaId: number;
//   status: boolean;
// }

const UserList = () => {
  const [users, setUsers] = useState<Users[] | null>(null);
  const [userData, setUserData] = useState<Users | null>(null);

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
  const editUser = (value: Users) => {
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
