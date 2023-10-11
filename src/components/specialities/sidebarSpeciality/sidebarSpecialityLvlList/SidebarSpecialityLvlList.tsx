import { useEffect, useState } from 'react';
import {
  DataSidebarSpeciality,
  ProjectType,
  typeSidebarSpecility,
} from '../../../../types/types';
import './sidebarSpecialityLvlList.css';
import { Option } from '../../../shared/dots/DotsOption';
import { axiosInstance } from '../../../../services/axiosInstance';
import { Input } from '../../..';
import {
  validateCorrectTyping,
  validateWhiteSpace,
} from '../../../../utils/customValidatesForm';
import colors from '../../../../utils/json/colorSidebar.json';

import {
  isOpenButtonDelete$,
  isOpenCardRegisteProject$,
} from '../../../../services/sharingSubject';
import { ContextMenuTrigger } from 'rctx-contextmenu';
import DotsRight from '../../../shared/dotsRight/DotsRight';
import { SubmitHandler, useForm } from 'react-hook-form';
interface SidebarSpecialityLvlListProps {
  data: DataSidebarSpeciality;
  type: typeSidebarSpecility;
  indexSelected: string;
  onSave?: () => void;
  authUser?: boolean;
}
interface FormData {
  name: string;
  cod?: string;
}

const SidebarSpecialityLvlList = ({
  data,
  type,
  onSave,
  indexSelected,
  authUser = true,
}: SidebarSpecialityLvlListProps) => {
  const [openEditData, setOpenEditData] = useState<boolean>(false);
  const isFirstLevel = type === 'sector';
  const isLastLevel = type === 'projects';
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    const handleClick = () => setOpenEditData(false);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const handleDuplicate = () => {
    const body = {
      name: data.name + ' copia',
    };
    axiosInstance
      .post(`/duplicates/project/${data.id}`, body)
      .then(() => onSave?.());
  };

  const handleForm: SubmitHandler<FormData> = async body => {
    axiosInstance.put(`/${type}/${data.id}`, body).then(() => {
      setOpenEditData(false);
      onSave?.();
    });
  };
  const handleDelete = (id: number) => {
    axiosInstance.delete(`/${type}/${id}`).then(() => {
      setOpenEditData(false);
      onSave?.();
    });
  };

  const handleOpenButtonDelete = (id: number) => {
    isOpenButtonDelete$.setSubject = {
      isOpen: true,
      function: () => () => handleDelete(id),
    };
  };
  const handleEdit = () => {
    if (type === 'projects') {
      isOpenCardRegisteProject$.setSubject = {
        isOpen: true,
        typeSpecialityId: null,
        project: data as ProjectType,
      };
      return;
    }
    reset({ name: data.name, cod: data.cod });
    setOpenEditData(!openEditData);
  };
  const style = {
    borderLeft: `thick solid ${colors[type]}`,
  };

  const dataDots: Option[] = [
    {
      name: openEditData ? 'Cancelar' : 'Editar',
      type: openEditData ? 'submit' : 'button',
      icon: openEditData ? 'close' : 'pencil',
      function: handleEdit,
    },
    {
      name: openEditData ? 'Guardar' : 'Eliminar',
      type: openEditData ? 'submit' : 'button',
      icon: openEditData ? 'save' : 'trash-red',
      function: openEditData
        ? handleSubmit(handleForm)
        : () => handleOpenButtonDelete(data.id),
    },
    {
      name: 'Duplicar',
      type: 'button',
      icon: 'document-duplicate',
      function: handleDuplicate,
    },
  ];

  return (
    <div className={`SidebarSpecialityLvlList-sub-list-item `} style={style}>
      <ContextMenuTrigger
        id={`sidebar-speciality-${type}-${data.id}`}
        className={`SidebarSpecialityLvlList-section  ${
          data.name + '-' + data.id === indexSelected &&
          'sidebarLevelList-sub-list-span-active'
        }`}
      >
        {openEditData ? (
          <form
            onSubmit={handleSubmit(handleForm)}
            className={`SidebarSpecialityLvlList-inputs`}
            onClick={e => e.stopPropagation()}
          >
            {type === 'specialities' && (
              <Input
                label="Nombre Cortos:"
                {...register('cod', {
                  validate: { validateWhiteSpace, validateCorrectTyping },
                })}
                name="cod"
                className="SidebarSpecialityLvlList-input"
                errors={errors}
              />
            )}
            <Input
              label="Nombre:"
              {...register('name', {
                validate: { validateWhiteSpace, validateCorrectTyping },
              })}
              name="name"
              className="SidebarSpecialityLvlList-input"
              errors={errors}
            />
            <input
              type="submit"
              className="sidebarSpecialityAddLvl-display-none"
            />
          </form>
        ) : (
          <>
            {!isLastLevel && (
              <>
                <input
                  type="checkbox"
                  className="SidebarSpecialityLvlList-dropdown-check"
                  defaultChecked={false}
                />
              </>
            )}
            <h4
              className={`SidebarSpecialityLvlList-sub-list-name  ${
                isFirstLevel && 'not-margin-left'
              } ${isLastLevel && 'letter-small'}   `}
            >
              {data.cod && (
                <span className="SidebarSpecialityLvlList-sub-list-span">
                  {data.cod}
                </span>
              )}
              {data.name}
              {data.CUI && (
                <span className="SidebarSpecialityLvlList-sub-list-span CUI">
                  CUI: {data.CUI}
                </span>
              )}
            </h4>
          </>
        )}
        {!isLastLevel && (
          <img
            src="/svg/down.svg"
            className="SidebarSpecialityLvlList-dropdown-arrow"
          />
        )}
      </ContextMenuTrigger>
      {authUser && (
        <DotsRight
          data={dataDots.slice(0, isLastLevel ? 3 : 2)}
          idContext={`sidebar-speciality-${type}-${data.id}`}
        />
      )}
    </div>
  );
};

export default SidebarSpecialityLvlList;
