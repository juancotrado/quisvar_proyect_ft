import Input from '../shared/Input/Input';
import { motion } from 'framer-motion';
import './CardRegisterUser.css';
import { useState } from 'react';

const CardRegisterUser = () => {
  const [selectedValue, setSelectedValue] = useState('');

  const handleSelectChange = (event: any) => {
    setSelectedValue(event.target.value);
  };
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
        <div className="select-area">
          <label htmlFor="email" className="input-label">
            Area
          </label>
          <select
            value={selectedValue}
            onChange={handleSelectChange}
            className="input-select"
          >
            <option>Seleccione</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
        </div>
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
