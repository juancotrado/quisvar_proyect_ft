import { useState } from 'react';
import './cardAddSpeciality.css';
import { Option, SpecialityType } from '../../../types/types';
import { SubmitHandler, useForm } from 'react-hook-form';
import { axiosInstance } from '../../../services/axiosInstance';
import DotsOption from '../../dots/DotsOption';

interface CardAddSpecialityProps {
  onSave?: () => void;
}

const CardAddSpeciality = ({ onSave }: CardAddSpecialityProps) => {
  const [isActive, setIsActive] = useState(true);
  const { handleSubmit, register, reset } = useForm<SpecialityType>();

  const onSubmit: SubmitHandler<SpecialityType> = values => {
    axiosInstance.post('/specialities', values).then(closeSubmit);
  };

  const handleActive = () => {
    setIsActive(!isActive);
  };

  const closeSubmit = () => {
    reset();
    handleActive();
    onSave?.();
  };

  const optionsData: Option[] = [
    {
      name: 'Cancelar',
      type: 'button',
      icon: 'close',
      function: () => {
        handleActive();
        reset();
      },
    },
    {
      name: 'Guardar',
      type: 'submit',
      icon: 'save',
    },
  ];

  return (
    <form className="speciality-add-card" onSubmit={handleSubmit(onSubmit)}>
      {isActive ? (
        <button
          className="speciality-content-add-card"
          type="button"
          onClick={handleActive}
        >
          + Agregar
        </button>
      ) : (
        <div className="text-area-card">
          <textarea
            className="text-areas"
            {...register('name', {
              validate: value => value.trim() !== '',
            })}
            name="name"
            placeholder="Ingrese nueva especialidad"
          />
          {!isActive && (
            <DotsOption data={optionsData} className="option-position" />
          )}
        </div>
      )}
    </form>
  );
};

export default CardAddSpeciality;
