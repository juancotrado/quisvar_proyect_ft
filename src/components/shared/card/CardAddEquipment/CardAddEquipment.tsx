import { useEffect, useRef, useState } from 'react';
import Modal from '../../../portal/Modal';
import './cardAddEquipment.css';
import { Subscription } from 'rxjs';
import { SubmitHandler, useForm } from 'react-hook-form';
import { isOpenCardAddEquipment$ } from '../../../../services/sharingSubject';
import { WorkStation } from '../../../../types/types';
import InputText from '../../Input/Input';
import { validateWhiteSpace } from '../../../../utils/customValidatesForm';
import Button from '../../button/Button';
import { axiosInstance } from '../../../../services/axiosInstance';
import { TextArea } from '../../..';
interface CardAddEquipmentProps {
  onSave: () => void;
}
const CardAddEquipment = ({ onSave }: CardAddEquipmentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleIsOpen = useRef<Subscription>(new Subscription());
  const {
    register,
    handleSubmit,
    // setValue,
    reset,
    // watch,
    formState: { errors },
  } = useForm<WorkStation>();
  useEffect(() => {
    handleIsOpen.current = isOpenCardAddEquipment$.getSubject.subscribe(value =>
      setIsOpen(value)
    );
    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, []);
  const onSubmit: SubmitHandler<WorkStation> = async data => {
    // console.log(data);
    const file = data.doc?.[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', `Remoto ${data.name}`);
    formData.append('total', data.total.toString());
    formData.append('price', data.price);
    formData.append('description', data.description);
    const headers = {
      'Content-type': 'multipart/form-data',
    };
    axiosInstance
      .post(`/workStation`, formData, { headers })
      .then(successfulShipment);
  };
  const successfulShipment = () => {
    onSave?.();
    setIsOpen(false);
    reset();
  };
  const closeFunctions = () => {
    setIsOpen(false);
    // onClose?.();
    // setErrorPassword({});
    reset();
  };
  return (
    <Modal size={50} isOpenProp={isOpen}>
      <form onSubmit={handleSubmit(onSubmit)} className="card-register-users">
        <span className="close-icon" onClick={closeFunctions}>
          <img src="/svg/close.svg" alt="pencil" />
        </span>
        <h1>Agregar Equipo</h1>
        <div className="col-input">
          <InputText
            {...register('name', {
              validate: { validateWhiteSpace },
            })}
            placeholder="N° 000"
            label="Equipo (remoto) N°"
            errors={errors}
            type="number"
          />
          <InputText
            {...register('total')}
            placeholder="#"
            label="Total de pantallas"
            errors={errors}
            type="number"
          />
        </div>
        <div className="col-input">
          <InputText
            {...register('doc')}
            placeholder=""
            errors={errors}
            label="Documento"
            type="file"
          />
          <InputText
            {...register('price', {
              validate: { validateWhiteSpace },
            })}
            placeholder="S/. 00.00"
            errors={errors}
            label="Precio S/."
            type="number"
          />
        </div>
        <TextArea
          {...register('description', {
            validate: { validateWhiteSpace },
          })}
          placeholder=""
          errors={errors}
          label="Description"
          className="card-equipment-description"
        />
        <div className="btn-build">
          <Button
            // text={user ? 'GUARDAR' : 'CREAR'}
            text="Crear"
            className="btn-area"
            whileTap={{ scale: 0.9 }}
            type="submit"
          />
        </div>
      </form>
    </Modal>
  );
};

export default CardAddEquipment;
