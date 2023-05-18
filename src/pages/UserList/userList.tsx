import { useEffect, useState } from 'react';
import './userList.css';
import { CardRegisterUser, UserDetail } from '../../components';
import Button from '../../components/shared/button/Button';
import { axiosInstance } from '../../services/axiosInstance';
import { isOpenModal$ } from '../../services/sharingSubject';
interface Users {
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
const UserList = () => {
  const [users, setUsers] = useState<Users[] | null>(null);
  const [usersData, setUsersData] = useState<Users | null>(null);
  useEffect(() => {
    axiosInstance
      .get('/users')
      .then(res => {
        console.log(res.data);
        setUsers(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  const addUser = () => {
    isOpenModal$.setSubject = true;
    setUsersData(null);
  };
  const editUser = (value: Users) => {
    isOpenModal$.setSubject = true;
    // console.log(value);

    setUsersData(value);
  };
  console.log(users);
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
                  onClick={() => editUser(value)}
                />
              ))}
          </tbody>
        </table>
      </div>
      <CardRegisterUser
        dataRegisterUser={usersData}
        onSave={() => {
          // getAreas();
          setUsersData(null);
        }}
      />
    </div>
  );
};

export default UserList;
