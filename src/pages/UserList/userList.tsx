import { useEffect, useState } from 'react';
import './userList.css';
import { CardRegisterUser, UserDetail } from '../../components';
import Button from '../../components/shared/button/Button';
import { axiosInstance } from '../../services/axiosInstance';
import { isOpenModal$ } from '../../services/sharingSubject';
import { Users } from '../../types/types';
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
  const [users, setUsers] = useState<Users | null>(null);
  const [usersData, setUsersData] = useState<Users | null>(null);
  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    await axiosInstance.get('/users').then(res => {
      setUsers(res.data);
    });
  };

  const addUser = () => {
    isOpenModal$.setSubject = true;
    setUsersData(null);
  };
  const editUser = (value: Users) => {
    isOpenModal$.setSubject = true;
    let datos = {
      id: value.id,
      email: value.email,
      password: value.password,
      profile: {
        firstName: value.profile.firstName,
        lastName: value.profile.lastName,
        dni: value.profile.dni,
        phone: value.profile.phone,
      },
      role: value.role,
      status: value.status,
    };
    setUsersData(datos);
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
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>USUARIO</th>
              <th>ROL</th>
              <th>ESTADO</th>
              <th>DNI</th>
              <th>CELULAR</th>
              <th>EDITAR</th>
            </tr>
          </thead>
          <tbody style={{ overflowY: 'auto' }}>
            {Array.isArray(users) &&
              users.map((value, index) => (
                <UserDetail
                  key={index}
                  user={value}
                  index={index}
                  onClick={() => editUser(value)}
                />
              ))}
          </tbody>
        </table>
      </div>
      <CardRegisterUser
        dataRegisterUser={usersData}
        onSave={() => {
          getUsers();
          setUsersData(null);
        }}
      />
    </div>
  );
};

export default UserList;
