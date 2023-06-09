import { useNavigate } from 'react-router-dom';
import { SpecialityType } from '../../../types/types';
import Button from '../../shared/button/Button';
import ButtonDelete from '../../shared/button/ButtonDelete';
import './cardspeciality.css';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { axiosInstance } from '../../../services/axiosInstance';

interface CardSpecialityProps {
  data: SpecialityType;
  role?: string;
  onUpdate?: () => void;
  onDelete?: () => void;
}

const CardSpeciality = ({
  data,
  role,
  onDelete,
  onUpdate,
}: CardSpecialityProps) => {
  const navigate = useNavigate();
  const [isEditable, setIsEditable] = useState(false);
  const { handleSubmit, register } = useForm<SpecialityType>();
  const handleNext = () => {
    navigate(`/especialidades/${data.id}`);
  };

  const onSubmit: SubmitHandler<SpecialityType> = values => {
    axiosInstance
      .put(`/specialities/${data.id}`, { name: values.name })
      .then(closeSubmit);
  };

  const closeSubmit = () => {
    onUpdate?.();
    setIsEditable(false);
  };
  return (
    <div className="speciality-card" onClick={handleNext} title={data.name}>
      <div className="speciality-main-title">
        {role !== 'EMPLOYEE' && (
          <div className="speciality-edit" onClick={e => e.stopPropagation()}>
            <ButtonDelete
              icon="trash-red"
              url={`/specialities/${data.id}`}
              className="speciality-delete-icon"
              onSave={onDelete}
            />
            <Button
              icon="pencil"
              className="speciality-edit-icon"
              onClick={() => setIsEditable(!isEditable)}
            />
          </div>
        )}
        {isEditable ? (
          <form
            className="editable-form"
            onSubmit={handleSubmit(onSubmit)}
            onClick={e => e.stopPropagation()}
          >
            <textarea
              {...register('name')}
              name="name"
              defaultValue={data.name}
              className="editable-title editable-color"
            />
            <button className="editable-submit" type="submit">
              Guardar
            </button>
          </form>
        ) : (
          <>
            <h2 className="editable-title">{data.name}</h2>
            {/* <div className="gradient"></div> */}
          </>
        )}
      </div>
      <span className=" card-quantity ">
        Proyectos Disponibles: {data._count?.projects}
      </span>
    </div>
  );
};

export default CardSpeciality;
