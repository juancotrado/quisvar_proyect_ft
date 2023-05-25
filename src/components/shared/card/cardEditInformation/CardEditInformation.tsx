import { useSelector } from 'react-redux';
import InputText from '../../Input/Input';
import Button from '../../button/Button';
import './cardEditInformation.css';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState } from '../../../../store';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Profile } from '../../../../types/types';
import { axiosInstance } from '../../../../services/axiosInstance';

const CardEditInformation = ({ isOpen, onClose }: any) => {
  const { userSession } = useSelector((state: RootState) => state);
  const { register, handleSubmit, reset } = useForm<Profile>();
  // const [data, setData] = useState([])
  // console.log(data?.profile.firstName);
  useEffect(() => {
    console.log(userSession);
    let datos = {
      firstName: userSession?.profile.firstName,
      lastName: userSession?.profile.lastName,
      dni: userSession?.profile.dni,
      phone: userSession?.profile.phone,
    };
    reset(datos);
  }, [userSession]);

  const onSubmit = async (values: Profile) => {
    if (userSession?.id !== undefined) {
      let saveData = {
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        dni: values.dni,
      };
      axiosInstance
        .put(`/profile/${userSession?.id}`, saveData)
        .then(successfulShipment);
    }
  };
  const successfulShipment = () => {
    // reset(InitialValues);
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
          <form onSubmit={handleSubmit(onSubmit)} className="col-input">
            <h1>INFORMACIÓN BÁSICA</h1>
            <div className="col-input">
              <Button
                text="CANCEL"
                onClick={onClose}
                className="bg-btn-close"
                type="button"
              />
              <Button text="GUARDAR" className="bg-inverse" type="submit" />
            </div>
          </form>
          <div className="divider"></div>
          <div className="col-input">
            <InputText {...register('firstName')} label="Nombres" />
            <InputText {...register('lastName')} label="Apellidos" />
          </div>
          <InputText {...register('phone')} label="Celular" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CardEditInformation;
