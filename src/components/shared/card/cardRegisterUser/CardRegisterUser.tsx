import Input from '../../Input/Input';
import { motion } from 'framer-motion';
import './CardRegisterUser.css';
import Select from '../../select/Select';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import Modal from '../../../portal/Modal';
import { axiosInstance } from '../../../../services/axiosInstance';
import { isOpenModal$ } from '../../../../services/sharingSubject';
import Button from '../../button/Button';
interface CardRegisterUserProps {
  onSave?: () => void;
  dataRegisterUser?: User | null;
}

type User = {
  id: number;
  email: string;
  password: string;
  profile: Profile;
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

const CardRegisterUser = ({
  dataRegisterUser,
  onSave,
}: CardRegisterUserProps) => {
  const [data, setData] = useState<User>(InitialValues);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (dataRegisterUser) {
      setData(dataRegisterUser);
      // console.log({ here: dataRegisterUser });
    }
  }, [dataRegisterUser]);

  const sendForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (dataRegisterUser) {
      axiosInstance.patch(`/users/${data.id}`, data).then(successfulShipment);
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
  }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = target;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setData({ ...data, [name]: value });
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
        />
        <Input
          defaultValue={data.password}
          placeholder="Contraseña"
          type="password"
          label="Contraseña"
          name="password"
          onChange={handleChange}
        />
        <div className="col-input">
          <Input
            defaultValue={data.profile.firstName}
            placeholder="Nombres"
            label="Nombres"
            name="firstName"
            onChange={handleChange}
          />
          <Input
            defaultValue={data.profile.lastName}
            placeholder="Apellidos"
            label="Apellidos"
            name="lastName"
            onChange={handleChange}
          />
        </div>
        <div className="col-input">
          <Input
            defaultValue={data.profile.dni}
            placeholder="N°"
            label="DNI"
            name="dni"
            onChange={handleChange}
          />
          <Input
            defaultValue={data.profile.phone}
            placeholder="Celular"
            label="Celular"
            name="phone"
            onChange={handleChange}
          />
          {/* <Select label="Area" data={data1} /> */}
        </div>
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
