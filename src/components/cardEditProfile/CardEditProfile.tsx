import Input from '../shared/Input/Input';
import { motion } from 'framer-motion';
import './CardEditProfile.css';

const CardEditUser = () => {
  const data = {
    //endpoint data answer
    email: 'diego@gmail.com',
    password: 'diego123',
    firstName: 'Diego',
    lastName: 'Milito',
    dni: '01010101',
    celular: '987654321',
    area: 'Salud',
  };
  const handleSave = () => {
    console.log('Guardado');
  };
  return (
    <div className="card-edit-profile">
      <h1>EDITAR PERFIL</h1>
      <Input
        placeholder={data.email}
        label="Correo"
        col={true}
        disabled={true}
      />
      <Input
        value={data.password}
        label="Contraseña"
        type="password"
        col={true}
        disabled={true}
      />
      <Input value={data.firstName} label="Nombre" col={true} />
      <Input value={data.lastName} label="Apellido" col={true} />
      <Input placeholder={data.dni} label="DNI" col={true} disabled={true} />
      <Input value={data.celular} label="Celular" col={true} />
      <Input placeholder={data.area} label="Area" col={true} disabled={true} />

      <div className="btn-build">
        <motion.button
          className="btn"
          whileTap={{ scale: 0.9 }}
          onClick={handleSave}
        >
          GUARDAR
        </motion.button>
      </div>
    </div>
  );
};

export default CardEditUser;
