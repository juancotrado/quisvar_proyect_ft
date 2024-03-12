import { useDispatch, useSelector } from 'react-redux';
import './cardEditInformation.css';
import { motion, AnimatePresence } from 'framer-motion';
import { AppDispatch, RootState } from '../../store';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { User } from '../../types';
import { axiosInstance } from '../../services/axiosInstance';
import { Button, Input } from '..';
import { CardRecoveryPassword } from '.';
import { getUserSession } from '../../store/slices/userSession.slice';

interface CardEditInformationProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const CardEditInformation = ({ isOpen, onClose }: CardEditInformationProps) => {
  const dispatch: AppDispatch = useDispatch();
  const [isOpenRecovery, setIsOpenRecovery] = useState(false);
  const userSession = useSelector((state: RootState) => state.userSession);
  const { register, handleSubmit, reset } = useForm<User>();

  useEffect(() => {
    if (userSession) {
      reset(userSession);
    }
  }, [reset, userSession]);

  const onSubmit = async (values: User) => {
    if (userSession?.id !== undefined) {
      const { firstName, lastName, phone, dni, description } = values.profile;
      const saveData = {
        firstName,
        lastName,
        phone,
        dni,
        description,
      };
      axiosInstance
        .put(`/profile/${userSession?.id}`, saveData)
        .then(() => dispatch(getUserSession()));
    }
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
              <Input {...register('profile.firstName')} label="Nombres" />
              <Input {...register('profile.lastName')} label="Apellidos" />
              <Input {...register('profile.phone')} label="Celular" />
              <Input {...register('profile.description')} label="Cargo" />
              <Input {...register('profile.dni')} label="DNI" disabled />
              <Input {...register('email')} label="Correo" disabled />
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
