import { useSelector } from 'react-redux';
import InputText from '../../Input/Input';
import Button from '../../button/Button';
import './cardEditInformation.css';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState } from '../../../../store';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Users } from '../../../../types/types';
import { axiosInstance } from '../../../../services/axiosInstance';

const CardEditInformation = ({ isOpen, onClose }: any) => {
  const { userSession } = useSelector((state: RootState) => state);
  const { register, handleSubmit, reset } = useForm<Users>();

  useEffect(() => {
    if (userSession) {
      reset(userSession);
    }
  }, [userSession]);

  const onSubmit = async (values: Users) => {
    console.log(userSession);

    if (userSession?.id !== undefined) {
      let saveData = {
        firstName: values.profile.firstName,
        lastName: values.profile.lastName,
        phone: values.profile.phone,
        dni: values.profile.dni,
      };
      axiosInstance
        .put(`/profile/${userSession?.id}`, saveData)
        .then(successfulShipment);
    }
  };
  const successfulShipment = () => {
    window.location.reload();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '+100%' }}
          animate={{ x: 0 }}
          exit={{ x: '+100%' }}
          transition={{ duration: 1 }}
          className="modal-edit-info"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="col-input">
              <h1>INFORMACIÓN BÁSICA</h1>
            </div>
            <div className="divider"></div>
            <section className="inputs-section">
              <InputText {...register('profile.firstName')} label="Nombres" />
              <InputText {...register('profile.lastName')} label="Apellidos" />
              <InputText {...register('profile.phone')} label="Celular" />
              <InputText {...register('profile.dni')} label="DNI" disabled />
              <InputText {...register('email')} label="Correo" disabled />
            </section>
            <div className="divider"></div>
            <div className="col-btns">
              <Button
                text="CANCEL"
                onClick={onClose}
                className="bg-btn-close"
                type="button"
              />
              <Button text="GUARDAR" className="bg-inverse" type="submit" />
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CardEditInformation;
