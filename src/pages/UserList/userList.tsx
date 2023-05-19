import { useEffect, useState } from 'react';
import './userList.css';
import { CardRegisterUser, UserDetail } from '../../components';
import Button from '../../components/shared/button/Button';
import { axiosInstance } from '../../services/axiosInstance';
import { isOpenModal$ } from '../../services/sharingSubject';
interface CreateUsers {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
  workAreaId: number;
  status: boolean;
}
type Users = {
  id: number;
  email: string;
  password: string;
  profile: Profile;
  role?: string;
  status?: boolean;
};
type Profile = {
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
};
const UserList = () => {
  const [users, setUsers] = useState<CreateUsers[] | null>(null);
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
    // console.log({ here2: datos });

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
              <th>AREA DE TRABAJO</th>
              <th>ESTADO</th>
              <th>DNI</th>
              <th>CELULAR</th>
              <th>EDITAR</th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((value, index) => (
                <UserDetail
                  key={index}
                  user={value}
                  index={index}
                  //@ts-ignore
                  onClick={() => editUser(value)} //help ps
                />
              ))}
          </tbody>
        </table>
      </div>
      <CardRegisterUser
        //@ts-ignore
        dataRegisterUser={usersData} //help ps
        onSave={() => {
          getUsers();
          setUsersData(null);
        }}
      />
    </div>
  );
};

export default UserList;
