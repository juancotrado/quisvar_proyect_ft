import { ChangeEvent, useState } from 'react';
import { Level, Option } from '../../../../../../types';
import './projectLevel.css';
import { DotsRight, Input, DropDownSimple } from '../../../../../../components';
import colors from '../../../../../../utils/json/colors.json';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  validateCorrectTyping,
  validateWhiteSpace,
} from '../../../../../../utils';
import { axiosInstance } from '../../../../../../services/axiosInstance';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../store';
import { ContextMenuTrigger } from 'rctx-contextmenu';
import { useListUsers } from '../../../../../../hooks';
import { isOpenButtonDelete$ } from '../../../../../../services/sharingSubject';
import { MoreInfo } from '..';
import { OptionLevel } from '../../pages/budgets/models/types';
import { OPTION_LEVEL_TEXT } from '../../pages/budgets/models';
import {
  handleCompressPdf,
  handleMergePdf,
} from '../../models/servicesProject';

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
  const modAuthProject = useSelector(
    (state: RootState) => state.modAuthProject
  );
  const [openOptionLevel, setOpenOptionLevel] = useState<OptionLevel>(null);
  const handleCloseEdit = () => setOpenOptionLevel(null);
  const handleOpenEdit = (option: OptionLevel) => {
    if (openOptionLevel) return setOpenOptionLevel(null);
    reset({ name: data.name });
    setOpenOptionLevel(option);
  };
  const { users: modedators } = useListUsers('MOD');
  const [idCoordinator, setIdCoordinator] = useState<number | null>(null);

  const onSubmitData: SubmitHandler<DataForm> = async body => {
    if (openOptionLevel === 'duplicate') {
      handleDuplicate(body.name);
    }

    if (openOptionLevel === 'lowerAdd') {
      handleAddLevelToUpperOrDown('lower', body.name);
    }

    if (openOptionLevel === 'upperAdd') {
      handleAddLevelToUpperOrDown('upper', body.name);
    }
    if (openOptionLevel === 'edit') {
      if (data.userId) body = { ...body, userId: idCoordinator ?? data.userId };
      await axiosInstance.put(`levels/${data.id}`, body);
      onSave?.();
    }
    resetValues();
  };
  const handleDeleteLevel = () => {
    axiosInstance.delete(`levels/${data.id}`).then(() => {
      onSave?.();
      resetValues();
    });
  };

  const handleOpenButtonDelete = () => {
    isOpenButtonDelete$.setSubject = {
      isOpen: true,
      function: () => handleDeleteLevel,
    };
  };
  const deleteUser = () => setIdCoordinator(null);
  const resetValues = () => {
    reset({});
    handleOpenEdit(null);
  };
  const handleDuplicate = (name: string) => {
    const body = {
      name,
    };
    axiosInstance
      .post(`/duplicates/level/${data.id}`, body)
      .then(() => onSave?.());
  };

  const handleAddLevelToUpperOrDown = (
    type: 'upper' | 'lower',
    name: string
  ) => {
    const body = {
      name,
    };
    axiosInstance
      .post(`/levels/${data.id}?type=${type}`, body)
      .then(() => onSave?.());
  };

  const handleCheck = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const arrChecked: string[] = JSON.parse(
      localStorage.getItem('arrCheckedLevel') ?? '[]'
    );
    const { checked } = target;
    if (checked) {
      arrChecked.push(String(data.id));
      localStorage.setItem('arrCheckedLevel', JSON.stringify(arrChecked));
    } else {
      const newArrChecked = arrChecked.filter(el => el !== String(data.id));
      localStorage.setItem('arrCheckedLevel', JSON.stringify(newArrChecked));
    }
  };
  const options: Option[] = [
    {
      name: openOptionLevel ? 'Cancelar' : 'Editar',
      type: openOptionLevel ? 'submit' : 'button',
      icon: openOptionLevel ? 'close' : 'pencil',
      function: () => handleOpenEdit('edit'),
    },

    {
      name: openOptionLevel ? 'Guardar' : 'Eliminar',
      type: openOptionLevel ? 'submit' : 'button',
      icon: openOptionLevel ? 'save' : 'trash-red',

      function: openOptionLevel
        ? handleSubmit(onSubmitData)
        : handleOpenButtonDelete,
    },
    {
      name: 'Duplicar',
      type: 'button',
      icon: 'document-duplicate',

      function: () => handleOpenEdit('duplicate'),
    },
    {
      name: 'Agregar arriba',
      type: 'button',
      icon: 'upper',

      function: () => handleOpenEdit('upperAdd'),
    },
    {
      name: 'Agrega abajo',
      type: 'button',
      icon: 'lower',

      function: () => handleOpenEdit('lowerAdd'),
    },
  ];
  const style = {
    borderLeft: `thick solid ${colors[data.level]}`,
  };

  const arrCheckedLevel: string[] = JSON.parse(
    localStorage.getItem('arrCheckedLevel') ?? '[]'
  );

  const handleCompresLevel = (type: 'pdf' | 'nopdf' | 'all') =>
    handleCompressPdf(type, 'level', data.id, data.name);

  const archiverOptions = [
    {
      name: 'Comprimir',
      fn: () => handleCompresLevel('all'),
      icon: 'zip-normal',
    },
    {
      name: 'Comprimir PDF',
      fn: () => handleCompresLevel('pdf'),
      icon: 'zip-pdf',
    },
    {
      name: 'Comprimir Editables',
      fn: () => handleCompresLevel('nopdf'),
      icon: 'zip-edit',
    },
    {
      name: 'Unir PDFs',
      fn: () => handleMergePdf('level', data.id, data.name),
      icon: 'merge-pdf',
    },
  ];

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
          <DotsRight
            data={options.slice(0, openOptionLevel ? 2 : Infinity)}
            idContext={`projectLevel-${data.id}`}
          />
        )}
        <ContextMenuTrigger id={`projectLevel-${data.id}`}>
          <div className={`projectLevel-section `}>
            <img src="/svg/down.svg" className="projectLevel-dropdown-arrow" />
            <input
              type="checkbox"
              className={`projectLevel-dropdown-check ${
                !modAuthProject && 'projectLevel-width-normal'
              }`}
              onChange={handleCheck}
              defaultChecked={arrCheckedLevel.includes(String(data.id))}
            />
            {/* <div className="projectLevel-contain"> */}
            <div className="projectLevel-name-contain">
              {openOptionLevel ? (
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
          <MoreInfo {...{ archiverOptions, data }} />
        </div>
      )}
      {openOptionLevel && (
        <p className="projectLevel-option-info">
          {OPTION_LEVEL_TEXT[openOptionLevel]}:
        </p>
      )}
    </div>
  );
};

export default ProjectLevel;
