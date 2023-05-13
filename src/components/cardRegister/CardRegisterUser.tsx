import Input from '../../components/shared/Input/Input';
import './CardRegisterUser.css';

const CardRegisterUser = () => {
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
        <Input placeholder="--Seleccione--" label="Área" />
      </div>
      <div className="btn-build">
        <button className="btn">CREAR</button>
      </div>
    </div>
  );
};

export default CardRegisterUser;
