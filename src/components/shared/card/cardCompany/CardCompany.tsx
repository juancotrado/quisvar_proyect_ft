import { useEffect, useRef, useState } from 'react';
import Modal from '../../../portal/Modal';
import { Subscription } from 'rxjs';
import './CardCompany.css';
import { isOpenCardCompany$ } from '../../../../services/sharingSubject';
import { Input } from '../../..';
import { SubmitHandler, useForm } from 'react-hook-form';
import Button from '../../button/Button';
import { Companies } from '../../../../types/types';
const CardCompany = () => {
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
  };
  useEffect(() => {
    handleIsOpen.current = isOpenCardCompany$.getSubject.subscribe(value =>
      setIsOpen(value)
    );
    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, []);
  const onSubmit: SubmitHandler<Companies> = async data => {
    console.log(data);
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
            {...register('ruc', { required: true, maxLength: 11 })}
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
            {...register('SEE')}
            name="SEE"
            errors={errors}
          />
          <Input label="CCI" {...register('CCI')} name="CCI" errors={errors} />
        </div>
        <Input
          label="Actividad economica"
          {...register('description')}
          name="description"
          errors={errors}
        />
        <Button text="Guardar" type="submit" />
      </form>
    </Modal>
  );
};

export default CardCompany;
