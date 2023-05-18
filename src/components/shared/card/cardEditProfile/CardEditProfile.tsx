import Input from '../../Input/Input';
import { motion } from 'framer-motion';
import './CardEditProfile.css';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { axiosInstance } from '../../services/axiosInstance';
import Modal from '../portal/Modal';
import { isOpenModal$ } from '../../services/sharingSubject';

interface CardEdtiUserProps {
  onSave?: () => void;
  dataUser?: User | null;
}

type User = {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
};

const InitialValues = {
  id: 0,
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  dni: '',
  phone: '',
};

const CardEditUser = ({ dataUser, onSave }: CardEdtiUserProps) => {
  const [data, setData] = useState<User>(InitialValues);
  const debounceRef = useRef<NodeJS.Timeout>();
  // const data = {
  //   //endpoint data answer
  //   email: 'diego@gmail.com',
  //   password: 'diego123',
  //   firstName: 'Diego',
  //   lastName: 'Milito',
  //   dni: '01010101',
  //   celular: '987654321',
  //   area: 'Salud',
  // };
  useEffect(() => {
    if (dataUser) {
      setData(dataUser);
      console.log(data);
    }
  }, [dataUser]);
  const sendForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axiosInstance
      .patch(`/users/${data.id}`, data)
      .then(successfulShipment)
      .catch(err => console.log(err.message));
  };

  const handleArea = ({
    target,
  }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = target;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setData({ ...data, [name]: value });
    }, 250);
  };

  const successfulShipment = () => {
    onSave?.();
    setData(InitialValues);
  };
  return (
    <Modal size={50}>
      <form onSubmit={sendForm} className="card-edit-profile">
        <h1>EDITAR PERFIL</h1>
        <Input
          placeholder={data.email}
          label="Correo"
          col={true}
          disabled={true}
          onChange={handleArea}
        />
        <Input
          value={data.password}
          label="Contraseña"
          type="password"
          col={true}
          disabled={true}
          onChange={handleArea}
        />
        <Input
          value={data.firstName}
          label="Nombre"
          col={true}
          onChange={handleArea}
        />
        <Input
          value={data.lastName}
          label="Apellido"
          col={true}
          onChange={handleArea}
        />
        <Input
          placeholder={data.dni}
          label="DNI"
          col={true}
          disabled={true}
          onChange={handleArea}
        />
        <Input
          value={data.phone}
          label="Celular"
          col={true}
          onChange={handleArea}
        />
        {/* <Input placeholder={data.} label="Area" col={true} disabled={true} onChange={handleArea} /> */}

        <div className="btn-build">
          <motion.button
            className="btn"
            whileTap={{ scale: 0.9 }}
            type="submit"
          >
            GUARDAR
          </motion.button>
        </div>
      </form>
    </Modal>
  );
};

export default CardEditUser;
