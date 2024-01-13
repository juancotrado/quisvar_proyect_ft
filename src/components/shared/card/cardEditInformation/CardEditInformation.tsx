import { useSelector } from 'react-redux';
import InputText from '../../Input/Input';
import Button from '../../../button/Button';
import './cardEditInformation.css';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState } from '../../../../store';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { User } from '../../../../types/types';
import { axiosInstance } from '../../../../services/axiosInstance';
import CardRecoveryPassword from './CardRecoveryPassword';

interface CardEditInformationProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const CardEditInformation = ({ isOpen, onClose }: CardEditInformationProps) => {
  const [isOpenRecovery, setIsOpenRecovery] = useState(false);
  const { userSession } = useSelector((state: RootState) => state);
  const { register, handleSubmit, reset } = useForm<User>();

  useEffect(() => {
    if (userSession) {
      reset(userSession);
    }
  }, [reset, userSession]);

  const onSubmit = async (values: User) => {
    if (userSession?.id !== undefined) {
      const saveData = {
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

  const handleOpenRecovery = () => setIsOpenRecovery(true);
  const handleCloseRecovery = () => setIsOpenRecovery(false);
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
                text="CAMBIAR CONTRASEÑA"
                onClick={handleOpenRecovery}
                className="bg-btn-close"
                type="button"
              />
              <Button
                text="CANCELAR"
                onClick={onClose}
                className="bg-btn-close"
                type="button"
              />
              <Button text="GUARDAR" className="bg-inverse" type="submit" />
            </div>
          </form>
          {isOpenRecovery && (
            <CardRecoveryPassword onClose={handleCloseRecovery} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CardEditInformation;
