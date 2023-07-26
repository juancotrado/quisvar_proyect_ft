import { Option, SpecialityType } from '../../../types/types';
import './cardspeciality.css';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { axiosInstance } from '../../../services/axiosInstance';
import DotsOption from '../../shared/dots/DotsOption';

interface CardSpecialityProps {
  data: SpecialityType;
  role?: string;
  onUpdate?: () => void;
  onDelete?: () => void;
  getProjects: (value: number) => void;
  selected: boolean;
  onSelect: () => void;
}

const CardSpeciality = ({
  data,
  role,
  onDelete,
  onUpdate,
  getProjects,
  selected,
  onSelect,
}: CardSpecialityProps) => {
  const [isEditable, setIsEditable] = useState(false);
  const { handleSubmit, register } = useForm<SpecialityType>();
  const handleProject = () => {
    if (selected) {
      onSelect();
    } else {
      onSelect();
    }
    getProjects(data.id);
  };

  const onSubmit: SubmitHandler<SpecialityType> = values => {
    axiosInstance
      .put(`/specialities/${data.id}`, { name: values.name })
      .then(closeSubmit);
  };
  // const numberProjects = data.typeSpecialities?._count?.projects
  const closeSubmit = () => {
    onUpdate?.();
    setIsEditable(false);
  };
  const handleDelete = async (id: number) => {
    setIsEditable(false);
    await axiosInstance.delete(`/specialities/${id}`).then(() => onDelete?.());
  };
  const optionsData: Option[] = [
    {
      name: isEditable ? 'Cancelar' : 'Editar',
      type: isEditable ? 'button' : 'button',
      icon: isEditable ? 'close' : 'pencil',
      function: () => {
        setIsEditable(!isEditable);
      },
    },
    {
      name: isEditable ? 'Guardar' : 'Eliminar',
      type: isEditable ? 'submit' : 'button',
      icon: isEditable ? 'save' : 'trash-red',
      function: () => {
        !isEditable && handleDelete(data.id);
      },
    },
  ];
  return (
    <div
      className={`speciality-card ${selected ? 'speciality-selected' : ''}`}
      onClick={handleProject}
      title={data.name}
    >
      <form
        className="speciality-main-title"
        onSubmit={handleSubmit(onSubmit)}
        // onClick={e => e.stopPropagation()}
      >
        {role !== 'EMPLOYEE' && (
          <div className="speciality-edit">
            <DotsOption data={optionsData} variant />
          </div>
        )}
        {isEditable ? (
          <div className="editable-form">
            <textarea
              {...register('name')}
              name="name"
              defaultValue={data.name}
              className="editable-title editable-color"
              onClick={event => {
                if (isEditable) {
                  event.stopPropagation();
                }
              }}
            />
          </div>
        ) : (
          <>
            <h2 className="editable-title">{data.name}</h2>
          </>
        )}
      </form>
      <span className=" card-quantity ">
        {/* Proyectos Disponibles: {numberProjects} */}
      </span>
    </div>
  );
};

export default CardSpeciality;
