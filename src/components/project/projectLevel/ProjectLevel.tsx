import { useState } from 'react';
import { Level } from '../../../types/types';
import './projectLevel.css';
import { Input } from '../..';
import colors from '../../../utils/json/colors.json';

import { SubmitHandler, useForm } from 'react-hook-form';
import {
  validateCorrectTyping,
  validateWhiteSpace,
} from '../../../utils/customValidatesForm';
import { Option } from '../../shared/dots/DotsOption';
import { axiosInstance } from '../../../services/axiosInstance';
import MoreInfo from '../moreInfo/MoreInfo';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import DotsRight from '../../shared/dotsRight/DotsRight';
import { ContextMenuTrigger } from 'rctx-contextmenu';
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
  const handleOpenEdit = () => {
    reset({ name: data.name });
    setOpenEdit(!openEdit);
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
    const body = {
      name: data.name + ' copia',
    };
    axiosInstance
      .post(`/duplicates/level/${data.id}`, body)
      .then(() => onSave?.());
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
  const style = {
    borderLeft: `thick solid ${colors[data.level]}`,
  };
  return (
    <div
      className={`projectLevel-sub-list-item  ${
        data.isInclude && 'dropdownLevel-Include'
      } ${data?.subTasks?.length && !data.isArea && 'dropdownLevel-Subtask'}  ${
        data.isArea && 'dropdownLevel-Area'
      } ${data.isProject && 'dropdownLevel-Project'}`}
      style={style}
    >
      <div className="projectLevel-contain">
        {modAuthProject && (
          <DotsRight data={options} idContext={`projectLevel-${data.id}`} />
        )}
        <ContextMenuTrigger id={`projectLevel-${data.id}`}>
          <div className={`projectLevel-section `}>
            <img src="/svg/down.svg" className="projectLevel-dropdown-arrow" />
            <input
              type="checkbox"
              className={`projectLevel-dropdown-check ${
                !modAuthProject && 'projectLevel-width-normal'
              }`}
              defaultChecked={false}
            />
            {/* <div className="projectLevel-contain"> */}
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
                  <span className="projectLevel-sub-list-span">
                    {data.item}
                  </span>
                  {data.name}
                </h4>
              )}
            </div>
            {/* </div> */}
          </div>
        </ContextMenuTrigger>
      </div>
      {modAuthProject && (
        <div className="projectLevel-contain-right">
          <MoreInfo data={data} />
        </div>
      )}
    </div>
  );
};

export default ProjectLevel;
