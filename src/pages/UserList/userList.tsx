import { useEffect, useState } from 'react';
import './userList.css';
import { UserDetail } from '../../components';
import { motion } from 'framer-motion';
import { axiosInstance } from '../../services/axiosInstance';

const UserList = () => {
  const [users, setUsers] = useState([]);
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
    console.log('Agregado');
  };
  console.log(users);

  return (
    <div className="content-list">
      <div className="user-list">
        <div className="list-title">
          <h1>LISTA DE USUARIOS</h1>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="btn-add"
            onClick={addUser}
          >
            &#10133; Agregar
          </motion.button>
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
            {users.map((value, index) => (
              <UserDetail key={index} user={value} index={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
