import { useState } from 'react';
import './userList.css';
import { UserDetail } from '../../components';
import { motion } from 'framer-motion';

const UserList = () => {
  const [users, setUsers] = useState([
    {
      name: 'Diego',
      area: 'GERENCIA',
      status: 'ACTIVO',
      dni: '01010101',
      phone: '987654321',
    },
    {
      name: 'Diego',
      area: 'GERENCIA',
      status: 'ACTIVO',
      dni: '01010101',
      phone: '987654321',
    },
    {
      name: 'Diego',
      area: 'GERENCIA',
      status: 'ACTIVO',
      dni: '01010101',
      phone: '987654321',
    },
    {
      name: 'Diego',
      area: 'GERENCIA',
      status: 'ACTIVO',
      dni: '01010101',
      phone: '987654321',
    },
    {
      name: 'Diego',
      area: 'GERENCIA',
      status: 'ACTIVO',
      dni: '01010101',
      phone: '987654321',
    },
  ]);

  const addUser = () => {
    const newUser = {
      name: 'Nuevo Usuario',
      area: 'Área',
      status: 'ACTIVO',
      dni: '12345678',
      phone: '123456789',
    };
    setUsers([...users, newUser]);
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
