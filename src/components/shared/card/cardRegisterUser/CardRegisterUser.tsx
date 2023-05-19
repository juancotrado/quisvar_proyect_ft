import Input from '../../Input/Input';
import './CardRegisterUser.css';
import Select from '../../select/Select';
import { FormEvent, useEffect, useRef, useState } from 'react';
import Modal from '../../../portal/Modal';
import { axiosInstance } from '../../../../services/axiosInstance';
import { isOpenModal$ } from '../../../../services/sharingSubject';
import Button from '../../button/Button';
interface CardRegisterUserProps {
  onSave?: () => void;
  dataRegisterUser?: User | null;
}

enum UserRole {
  'ADMIN',
  'EMPLOYEE',
  'MOD',
}
type User = {
  id: number;
  email: string;
  password: string;
  profile: Profile;
  role?: UserRole;
  status?: boolean | string;
};
type Profile = {
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
};
const InitialValues = {
  id: 0,
  email: '',
  password: '',
  profile: {
    firstName: '',
    lastName: '',
    dni: '',
    phone: '',
  },
};

const roles = [{ role: 'ADMIN' }, { role: 'EMPLOYEE' }, { role: 'MOD' }];
const status = [{ status: 'Activo' }, { status: 'Inactivo' }];

const CardRegisterUser = ({
  dataRegisterUser,
  onSave,
}: CardRegisterUserProps) => {
  const [data, setData] = useState<User>(InitialValues);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (dataRegisterUser) {
      setData(dataRegisterUser);
    }
  }, [dataRegisterUser]);

  const sendForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (dataRegisterUser) {
      console.log({ here: data });

      let newData = {
        role: data.role,
        status: data.status == 'Active' ? true : false,
      };
      axiosInstance
        .patch(`/users/${data.id}`, newData)
        .then(successfulShipment);
    } else {
      axiosInstance.post(`/users`, data).then(successfulShipment);
    }
  };
  const successfulShipment = () => {
    onSave?.();
    setData(InitialValues);
    window.location.reload();
  };
  const handleChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = target;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setData({
        ...data,
        [name]: value,
      });
    }, 250);
  };

  const closeFunctions = () => {
    isOpenModal$.setSubject = false;
    setData(InitialValues);
  };

  return (
    <Modal size={50}>
      <form onSubmit={sendForm} className="card-register-users">
        <span className="close-icon" onClick={closeFunctions}>
          <img src="/svg/close.svg" alt="pencil" />
        </span>
        <h1>
          {dataRegisterUser
            ? 'EDITAR DATOS DE USUARIO'
            : 'REGISTRO DE NUEVO USUARIO'}
        </h1>
        <Input
          defaultValue={data.email}
          placeholder="Correo"
          title="Correo"
          label="Correo"
          name="email"
          onChange={handleChange}
          disabled={dataRegisterUser ? true : false}
        />
        {!dataRegisterUser ? (
          <Input
            defaultValue={data.password}
            placeholder="Contraseña"
            type="password"
            label="Contraseña"
            name="password"
            onChange={handleChange}
          />
        ) : (
          ''
        )}
        <div className="col-input">
          <Input
            defaultValue={data.profile.firstName}
            placeholder="Nombres"
            label="Nombres"
            name="firstName"
            onChange={handleChange}
            disabled={dataRegisterUser ? true : false}
          />
          <Input
            defaultValue={data.profile.lastName}
            placeholder="Apellidos"
            label="Apellidos"
            name="lastName"
            onChange={handleChange}
            disabled={dataRegisterUser ? true : false}
          />
        </div>
        <div className="col-input">
          <Input
            defaultValue={data.profile.dni}
            placeholder="N°"
            label="DNI"
            name="dni"
            onChange={handleChange}
            disabled={dataRegisterUser ? true : false}
          />
          <Input
            defaultValue={data.profile.phone}
            placeholder="Celular"
            label="Celular"
            name="phone"
            onChange={handleChange}
            disabled={dataRegisterUser ? true : false}
          />
        </div>
        {dataRegisterUser ? (
          <div className="col-input">
            <Select
              label="Rol"
              defaultValue={data.role}
              data={roles}
              name="role"
              itemKey="role"
              textField="role"
              onChange={handleChange}
            />
            <Select
              label="Status"
              defaultValue={data.status ? 'Activo' : 'Inactivo'}
              data={status}
              name="status"
              itemKey="status"
              textField="status"
              onChange={handleChange}
            />
          </div>
        ) : (
          ''
        )}
        <div className="btn-build">
          <Button
            text={dataRegisterUser ? 'CREAR' : 'GUARDAR'}
            className="btn-area"
            whileTap={{ scale: 0.9 }}
            type="submit"
          />
        </div>
      </form>
    </Modal>
  );
};

export default CardRegisterUser;
