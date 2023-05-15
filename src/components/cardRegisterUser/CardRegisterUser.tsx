import Input from '../shared/Input/Input';
import { motion } from 'framer-motion';
import './CardRegisterUser.css';
import { Select } from '..';

const CardRegisterUser = () => {
  const data1 = [
    //endpoint data answer
    { name: 'Salud' },
    { name: 'Saneamiento' },
    { name: 'Carreteras' },
  ];
  return (
    <div className="card-register-user">
      <h1>REGISTRO DE NUEVO USUARIO</h1>
      <Input placeholder="Correo" title="Correo" label="Correo" />
      <Input placeholder="Contraseña" type="password" label="Contraseña" />
      <div className="col">
        <Input placeholder="Nombres" label="Nombres" />
        <Input placeholder="Apellidos" label="Apellidos" />
      </div>
      <div className="col">
        <Input placeholder="N°" label="DNI" />
        <Input placeholder="Celular" label="Celular" />
        <Select label="Area" data={data1} />
      </div>
      <div className="btn-build">
        <motion.button className="btn" whileTap={{ scale: 0.9 }}>
          CREAR
        </motion.button>
      </div>
    </div>
  );
};

export default CardRegisterUser;
