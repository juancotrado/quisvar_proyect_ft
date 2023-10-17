import { useEffect, useRef, useState } from 'react';
import Modal from '../../../portal/Modal';
import { SubmitHandler, useForm } from 'react-hook-form';
import './cardAddTraining.css';
import { Input } from '../../..';
import { TrainingSpecialty } from '../../../../types/types';
import Button from '../../button/Button';
import { Subscription } from 'rxjs';
import { isOpenAddTraining$ } from '../../../../services/sharingSubject';
import { useParams } from 'react-router-dom';
import { axiosInstance } from '../../../../services/axiosInstance';

interface CardAddTrainingProps {
  onSave?: () => void;
}

const CardAddTraining = ({ onSave }: CardAddTrainingProps) => {
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
  } = useForm<TrainingSpecialty>();
  useEffect(() => {
    handleIsOpen.current = isOpenAddTraining$.getSubject.subscribe(value =>
      setIsOpen(value)
    );
    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, []);
  const closeFunctions = () => {
    setIsOpen(false);
    reset({});
  };
  const onSubmit: SubmitHandler<TrainingSpecialty> = async data => {
    const files = data.trainingFile?.[0];
    const issue = data.issue.toString() ?? '';
    const startDate = data.startDate.toString() ?? '';
    const untilDate = data.untilDate.toString() ?? '';
    const specialistId = infoId?.toString() ?? '';
    const formData = new FormData();
    formData.append('trainingName', data.trainingName);
    formData.append('institution', data.institution);
    formData.append('hours', data.hours);
    formData.append('startDate', startDate);
    formData.append('untilDate', untilDate);
    formData.append('issue', issue);
    formData.append('specialistId', specialistId);
    formData.append('trainingFile', files);
    const headers = {
      'Content-type': 'multipart/form-data',
    };
    axiosInstance.post(`/trainingSpecialty`, formData, { headers }).then(() => {
      setIsOpen(false);
      reset({});
      onSave?.();
    });
  };
  return (
    <Modal size={50} isOpenProp={isOpen}>
      <form onSubmit={handleSubmit(onSubmit)} className="card-specialist">
        <span className="close-icon" onClick={closeFunctions}>
          <img src="/svg/close.svg" alt="pencil" />
        </span>
        <h1>Registrar Capacitacion</h1>

        <div className="specialist-col">
          <Input
            label="Tipo de Capacitacion"
            placeholder="Tipo"
            {...register('trainingName')}
            name="trainingName"
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
            label="Desde"
            type="date"
            {...register('startDate')}
            name="startDate"
            errors={errors}
          />
          <Input
            label="Hasta"
            type="date"
            {...register('untilDate')}
            name="untilDate"
            errors={errors}
          />
          <Input
            label="Fecha de Emision"
            type="date"
            {...register('issue')}
            name="issue"
            errors={errors}
          />
        </div>
        <div className="specialist-col">
          <Input
            label="Horas"
            placeholder="Nº de horas"
            {...register('hours')}
            name="hours"
            errors={errors}
          />
          <Input
            label="Documento"
            type="file"
            {...register('trainingFile')}
            name="trainingFile"
            errors={errors}
          />
        </div>
        <Button text="Guardar" type="submit" />
      </form>
    </Modal>
  );
};

export default CardAddTraining;
