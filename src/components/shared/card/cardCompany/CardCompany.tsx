import { useEffect, useRef, useState } from 'react';
import Modal from '../../../portal/Modal';
import { Subscription } from 'rxjs';
import './CardCompany.css';
import { isOpenCardCompany$ } from '../../../../services/sharingSubject';
import { Input } from '../../..';
import { SubmitHandler, useForm } from 'react-hook-form';
import Button from '../../button/Button';
import { Companies } from '../../../../types/types';
import { axiosInstance } from '../../../../services/axiosInstance';
import {
  validateJPGExtension,
  validateRuc,
} from '../../../../utils/customValidatesForm';
type CardCompanyProps = {
  onSave?: () => void;
};
const CardCompany = ({ onSave }: CardCompanyProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleIsOpen = useRef<Subscription>(new Subscription());
  const {
    register,
    handleSubmit,
    // setValue,
    reset,
    // watch,
    formState: { errors },
  } = useForm<Companies>();
  const closeFunctions = () => {
    setIsOpen(false);
    reset({});
    // onSave?.();
  };
  useEffect(() => {
    handleIsOpen.current = isOpenCardCompany$.getSubject.subscribe(value =>
      setIsOpen(value)
    );
    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, []);
  const onSubmit: SubmitHandler<Companies> = data => {
    const img = data.img?.[0];
    const formData = new FormData();
    formData.append('img', img ?? '');
    formData.append('name', data.name);
    formData.append('ruc', data.ruc);
    formData.append('manager', data.manager);
    formData.append('address', data.address);
    formData.append('departure', data.departure);
    if (data.inscription) {
      formData.append('inscription', data.inscription.toString());
    }
    if (data.activities) {
      formData.append('activities', data.activities.toString());
    }
    if (data.SEE) {
      formData.append('SEE', data.SEE.toString());
    }
    formData.append('CCI', data.CCI);
    formData.append('description', data.description);
    const headers = {
      'Content-type': 'multipart/form-data',
    };
    axiosInstance.post(`/companies`, formData, { headers }).then(() => {
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
        <h1>Registrar empresa</h1>
        <div className="company-col">
          <Input
            label="Empresa"
            {...register('name', { required: true })}
            name="name"
            errors={errors}
          />
          <Input
            label="Ruc"
            type="number"
            {...register('ruc', { validate: validateRuc })}
            name="ruc"
            errors={errors}
          />
        </div>
        <Input
          label="Gerente General"
          {...register('manager', { required: true })}
          name="manager"
          errors={errors}
        />
        <div className="company-col">
          <Input
            label="Domicilio fiscal"
            {...register('address', { required: true })}
            name="address"
            errors={errors}
          />
          <Input
            label="Nº de partida registral"
            {...register('departure', { required: true })}
            name="departure"
            errors={errors}
          />
        </div>
        <div className="company-col">
          <Input
            label="Fecha de inscripcion"
            type="date"
            {...register('inscription')}
            name="inscription"
            errors={errors}
          />
          <Input
            label="Inicio de actividades"
            type="date"
            {...register('activities')}
            name="activities"
            errors={errors}
          />
        </div>
        <div className="company-col">
          <Input
            label="S.E.E."
            type="date"
            {...register('SEE')}
            name="SEE"
            errors={errors}
          />
          <Input label="CCI" {...register('CCI')} name="CCI" errors={errors} />
        </div>
        <div className="company-col">
          <Input
            label="Actividad economica"
            {...register('description')}
            name="description"
            errors={errors}
          />
          <Input
            {...register('img', { validate: validateJPGExtension })}
            placeholder=""
            errors={errors}
            label="Imagen de la empresa (.jpg)"
            type="file"
          />
        </div>
        <Button text="Guardar" type="submit" />
      </form>
    </Modal>
  );
};

export default CardCompany;
