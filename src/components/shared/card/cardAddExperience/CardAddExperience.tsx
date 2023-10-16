import { useEffect, useRef, useState } from 'react';
import Modal from '../../../portal/Modal';
import { SubmitHandler, useForm } from 'react-hook-form';
import './cardAddExperience.css';
import { Input } from '../../..';
import { AreaSpecialty } from '../../../../types/types';
import Button from '../../button/Button';
import { Subscription } from 'rxjs';
import { isOpenAddExperience$ } from '../../../../services/sharingSubject';
import { useParams } from 'react-router-dom';
import { axiosInstance } from '../../../../services/axiosInstance';

interface CardExperienceProps {
  onSave?: () => void;
}

const CardAddExperience = ({ onSave }: CardExperienceProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { infoId } = useParams();
  const handleIsOpen = useRef<Subscription>(new Subscription());
  const {
    register,
    handleSubmit,
    // setValue,
    reset,
    // watch,
    formState: { errors },
  } = useForm<AreaSpecialty>();
  useEffect(() => {
    handleIsOpen.current = isOpenAddExperience$.getSubject.subscribe(value =>
      setIsOpen(value)
    );
    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, []);
  const closeFunctions = () => {
    setIsOpen(false);
    reset({});
    onSave?.();
  };
  const onSubmit: SubmitHandler<AreaSpecialty> = async data => {
    const files = data.file?.[0];

    const startDate = data.startDate.toString() ?? '';
    const untilDate = data.untilDate.toString() ?? '';
    const specialistId = infoId?.toString() ?? '';
    const formData = new FormData();
    formData.append('specialtyName', 'asd');
    formData.append('institution', data.institution);
    formData.append('startDate', startDate);
    formData.append('untilDate', untilDate);
    formData.append('specialistId', specialistId);
    formData.append('file', files);
    const headers = {
      'Content-type': 'multipart/form-data',
    };
    axiosInstance
      .post(`/areaSpecialty`, formData, { headers })
      .then(closeFunctions);
  };
  return (
    <Modal size={50} isOpenProp={isOpen}>
      <form onSubmit={handleSubmit(onSubmit)} className="card-specialist">
        <span className="close-icon" onClick={closeFunctions}>
          <img src="/svg/close.svg" alt="pencil" />
        </span>
        <h1>Registrar Experiencia</h1>

        <div className="specialist-col">
          <Input
            label="Nombre de Especialidad"
            placeholder="Nombre"
            {...register('specialtyName')}
            name="specialtyName"
            errors={errors}
          />
          <Input
            label="Institucion"
            placeholder="Institucion"
            {...register('institution')}
            name="institution"
            errors={errors}
          />
        </div>

        <div className="specialist-col">
          <Input
            label="Inicio"
            type="date"
            {...register('startDate')}
            name="startDate"
            errors={errors}
          />
          <Input
            label="Fin"
            type="date"
            {...register('untilDate')}
            name="untilDate"
            errors={errors}
          />
          <Input
            label="Documento"
            type="file"
            {...register('file')}
            name="file"
            errors={errors}
          />
        </div>
        <Button text="Guardar" type="submit" />
      </form>
    </Modal>
  );
};

export default CardAddExperience;
