import { MouseEvent, useState } from 'react';
import { Level } from '../../../types/types';
import './projectLevel.css';
import { Input } from '../..';
import colors from '../../../utils/json/colors.json';

import { SubmitHandler, useForm } from 'react-hook-form';
import {
  validateCorrectTyping,
  validateWhiteSpace,
} from '../../../utils/customValidatesForm';
import DotsOption, { Option } from '../../shared/dots/DotsOption';
import { axiosInstance } from '../../../services/axiosInstance';
import MoreInfo from '../moreInfo/MoreInfo';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
interface ProjectLevelProps {
  data: Level;
  onSave?: () => void;
}
interface DataForm {
  name: string;
}
const ProjectLevel = ({ data, onSave }: ProjectLevelProps) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<DataForm>();
  const { modAuthProject } = useSelector((state: RootState) => state);
  const [openEdit, setOpenEdit] = useState(false);
  const handleCloseEdit = () => setOpenEdit(false);
  const [isClickRight, setIsClickRight] = useState(false);
  const handleOpenEdit = () => {
    reset({ name: data.name });
    setOpenEdit(!openEdit);
    setIsClickRight(false);
  };

  const handleClickRigth = (e: MouseEvent<HTMLDivElement>) => {
    if (!modAuthProject) return;
    e.preventDefault();
    setIsClickRight(!isClickRight);
  };
  const onSubmitData: SubmitHandler<DataForm> = async body => {
    axiosInstance.put(`levels/${data.id}`, body).then(() => resetValues());
  };
  const handleDeleteLevel = () => {
    axiosInstance.delete(`levels/${data.id}`).then(() => resetValues());
  };

  const resetValues = () => {
    onSave?.();
    reset({});
    handleOpenEdit();
  };
  const handleDuplicate = () => {
    axiosInstance.post(`/duplicates/level/${data.id}`).then(() => onSave?.());
  };
  const options: Option[] = [
    {
      name: openEdit ? 'Cancelar' : 'Editar',
      type: openEdit ? 'submit' : 'button',
      icon: openEdit ? 'close' : 'pencil',
      function: handleOpenEdit,
    },

    {
      name: openEdit ? 'Guardar' : 'Eliminar',
      type: openEdit ? 'submit' : 'button',
      icon: openEdit ? 'save' : 'trash-red',

      function: openEdit ? handleSubmit(onSubmitData) : handleDeleteLevel,
    },
    {
      name: 'Duplicar',
      type: 'button',
      icon: 'document-duplicate',

      function: handleDuplicate,
    },
  ];
  const isAreaOrProject = data.isArea || data.isProject;
  const style = {
    borderLeft: `thick solid ${colors[data.level]}`,
  };
  return (
    <div
      className={`projectLevel-sub-list-item ${
        isAreaOrProject && 'dropdownLevel-ProjectArea'
      } ${data?.subTasks?.length && 'dropdownLevel-Subtask'}`}
      style={style}
    >
      {modAuthProject && (
        <DotsOption
          className="projectLevel-menu-dots-option"
          notPositionRelative
          iconHide
          isClickRight={isClickRight}
          data={options}
        />
      )}
      <div className={`projectLevel-section `} onContextMenu={handleClickRigth}>
        <img src="/svg/down.svg" className="projectLevel-dropdown-arrow" />
        <input
          type="checkbox"
          className="projectLevel-dropdown-check"
          defaultChecked={false}
        />
        <div className="projectLevel-contain">
          <div className="projectLevel-name-contain">
            {openEdit ? (
              <form
                onSubmit={handleSubmit(onSubmitData)}
                className="projectLevel-form"
              >
                <Input
                  {...register('name', {
                    validate: { validateWhiteSpace, validateCorrectTyping },
                  })}
                  name="name"
                  placeholder={`Editar nombre del nivel`}
                  className="projectLevel-input"
                  errors={errors}
                />
                <figure
                  className="projectLevel-figure"
                  onClick={handleCloseEdit}
                >
                  <img src="/svg/icon_close.svg" alt="W3Schools" />
                </figure>
              </form>
            ) : (
              <h4 className={`projectLevel-sub-list-name`}>
                <span className="projectLevel-sub-list-span">{data.item} </span>{' '}
                {data.name}
              </h4>
            )}
          </div>
          {modAuthProject && (
            <div className="projectLevel-contain-right">
              <MoreInfo data={data} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectLevel;
