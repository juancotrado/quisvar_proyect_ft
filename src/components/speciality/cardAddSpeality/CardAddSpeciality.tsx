import { useState } from 'react';
import './cardAddSpeciality.css';
import { SpecialityType } from '../../../types/types';
import { SubmitHandler, useForm } from 'react-hook-form';
import { axiosInstance } from '../../../services/axiosInstance';

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
        <textarea
          className="text-area-card"
          {...register('name')}
          name="name"
          placeholder="Ingrese nueva especialidad"
        />
      )}
      {!isActive && (
        <>
          <button
            className="close-add-card"
            type="button"
            onClick={() => {
              handleActive();
              reset();
            }}
          >
            <img src="public/svg/close.svg" />
          </button>
          <button className="editable-add-submit" type="submit">
            Registrar
          </button>
        </>
      )}
    </form>
  );
};

export default CardAddSpeciality;
