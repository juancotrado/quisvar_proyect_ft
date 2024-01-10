import { useEffect, useRef, useState } from 'react';
import Modal from '../../../portal/Modal';
import { Subscription } from 'rxjs';
import './cardConsortium.css';
import { isOpenCardConsortium$ } from '../../../../services/sharingSubject';
import { Input } from '../../..';
import { SubmitHandler, useForm } from 'react-hook-form';
import Button from '../../button/Button';
import { ConsortiumType } from '../../../../types/types';
import { axiosInstance } from '../../../../services/axiosInstance';
import { validateJPGExtension } from '../../../../utils/customValidatesForm';

type CardConsortiumProps = {
  onSave?: () => void;
};

const CardConsortium = ({ onSave }: CardConsortiumProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleIsOpen = useRef<Subscription>(new Subscription());
  const {
    register,
    handleSubmit,
    // setValue,
    reset,
    // watch,
    formState: { errors },
  } = useForm<ConsortiumType>();
  const closeFunctions = () => {
    setIsOpen(false);
    reset({});
    // onSave?.();
  };
  useEffect(() => {
    handleIsOpen.current = isOpenCardConsortium$.getSubject.subscribe(value =>
      setIsOpen(value)
    );
    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, []);
  const onSubmit: SubmitHandler<ConsortiumType> = data => {
    const img = data.img?.[0];
    const formData = new FormData();
    formData.append('img', img ?? '');
    formData.append('name', data.name);
    formData.append('manager', data.manager);

    const headers = {
      'Content-type': 'multipart/form-data',
    };
    axiosInstance.post(`/consortium`, formData, { headers }).then(() => {
      closeFunctions();
      onSave?.();
    });
  };
  return (
    <Modal size={50} isOpenProp={isOpen}>
      <form onSubmit={handleSubmit(onSubmit)} className="card-company">
        <span className="close-icon" onClick={closeFunctions}>
          <img src="/svg/close.svg" alt="pencil" />
        </span>
        <h1>Registrar Consorcio</h1>
        <div className="company-col">
          <Input
            label="Consorcio"
            {...register('name', { required: true })}
            name="name"
            errors={errors}
          />
          <Input
            label="Representante"
            {...register('manager', { required: true })}
            name="ruc"
            errors={errors}
          />
        </div>
        <Input
          {...register('img', { validate: validateJPGExtension })}
          placeholder=""
          errors={errors}
          label="Imagen del consorcio (.jpg)"
          type="file"
        />
        <Button text="Guardar" type="submit" />
      </form>
    </Modal>
  );
};

export default CardConsortium;
