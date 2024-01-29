import { useState } from 'react';
import { Level, Option } from '../../../../../../../../types';
import './projectLevel.css';
import {
  DotsRight,
  Input,
  DropDownSimple,
} from '../../../../../../../../components';
import colors from '../../../../../../../../utils/json/colors.json';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  validateCorrectTyping,
  validateWhiteSpace,
} from '../../../../../../../../utils';
import { axiosInstance } from '../../../../../../../../services/axiosInstance';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../../../store';
import { ContextMenuTrigger } from 'rctx-contextmenu';
import { useListUsers } from '../../../../../../../../hooks';
import { isOpenButtonDelete$ } from '../../../../../../../../services/sharingSubject';
import { MoreInfo } from '..';

interface ProjectLevelProps {
  data: Level;
  onSave?: () => void;
}
interface DataForm {
  name: string;
  userId?: number;
}
export const ProjectLevel = ({ data, onSave }: ProjectLevelProps) => {
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
  const { users: modedators } = useListUsers(['MOD']);
  const [idCoordinator, setIdCoordinator] = useState<number | null>(null);

  const onSubmitData: SubmitHandler<DataForm> = async body => {
    if (data.userId) body = { ...body, userId: idCoordinator ?? data.userId };
    axiosInstance.put(`levels/${data.id}`, body).then(() => resetValues());
  };
  const handleDeleteLevel = () => {
    axiosInstance.delete(`levels/${data.id}`).then(() => resetValues());
  };

  const handleOpenButtonDelete = () => {
    isOpenButtonDelete$.setSubject = {
      isOpen: true,
      function: () => handleDeleteLevel,
    };
  };
  const deleteUser = () => setIdCoordinator(null);
  const resetValues = () => {
    onSave?.();
    reset({});
    handleOpenEdit();
  };
  const handleDuplicate = () => {
    const body = {
      name: `${data.name}(${Date.now()})`,
    };
    axiosInstance
      .post(`/duplicates/level/${data.id}`, body)
      .then(() => onSave?.());
  };

  const handleAddLevelToUpperOrDown = (type: 'upper' | 'lower') => {
    const body = {
      name: `${data.name}(${Date.now()})`,
    };
    axiosInstance
      .post(`/levels/${data.id}?type=${type}`, body)
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

      function: openEdit ? handleSubmit(onSubmitData) : handleOpenButtonDelete,
    },
    {
      name: 'Duplicar',
      type: 'button',
      icon: 'document-duplicate',

      function: handleDuplicate,
    },
    {
      name: 'Agregar arriba',
      type: 'button',
      icon: 'upper',

      function: () => handleAddLevelToUpperOrDown('upper'),
    },
    {
      name: 'Agrega abajo',
      type: 'button',
      icon: 'lower',

      function: () => handleAddLevelToUpperOrDown('lower'),
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
                  <div className="projectLevel-input-name">
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
                  </div>
                  {data.userId && (
                    <DropDownSimple
                      data={modedators}
                      itemKey="id"
                      textField="name"
                      type="search"
                      name="employees"
                      deleteUser={deleteUser}
                      selector
                      defaultInput={
                        data.user?.profile.firstName +
                        '' +
                        data.user?.profile.lastName
                      }
                      className="projectLevel-employee-list"
                      placeholder="Coordinador de Area"
                      valueInput={(_name, index) => setIdCoordinator(+index)}
                    />
                  )}
                </form>
              ) : (
                <div className={`projectLevel-sub-list-name`}>
                  <span className="projectLevel-sub-list-span">
                    {data.item}
                  </span>
                  {data.name}
                  {data.userId && (
                    <h3 className="projectLevel-sub-list-coord">
                      Coordinador: {data.user?.profile.firstName}{' '}
                      {data.user?.profile.lastName}
                    </h3>
                  )}
                </div>
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
