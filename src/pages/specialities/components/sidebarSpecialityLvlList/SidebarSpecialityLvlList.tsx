import { ChangeEvent, useEffect, useState } from 'react';
import {
  DataSidebarSpeciality,
  Option,
  typeSidebarSpecility,
} from '../../../../types';
import './sidebarSpecialityLvlList.css';
import { axiosInstance } from '../../../../services/axiosInstance';
import { DotsRight, Input } from '../../../../components';
import { validateCorrectTyping, validateWhiteSpace } from '../../../../utils';
import colors from '../../../../utils/json/colorSidebar.json';
import {
  isOpenButtonDelete$,
  isOpenCardRegisteProject$,
} from '../../../../services/sharingSubject';
import { ContextMenuTrigger } from 'rctx-contextmenu';
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
    isOpenCardRegisteProject$.setSubject = {
      isOpen: true,
      typeSpecialityId: null,
      isDuplicate: true,
      idProject: data.id,
    };
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
    reset({ name: data.name, cod: data.cod });
    setOpenEditData(!openEditData);
  };
  const style = {
    borderLeft: `thick solid ${colors[type]}`,
  };

  const value = `${type}-${data.id}`;
  const handleCheck = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const arrChecked: string[] = JSON.parse(
      localStorage.getItem('arrChecked') ?? '[]'
    );
    const { checked } = target;
    if (checked) {
      arrChecked.push(value);
      localStorage.setItem('arrChecked', JSON.stringify(arrChecked));
    } else {
      const newArrChecked = arrChecked.filter(el => el !== value);
      localStorage.setItem('arrChecked', JSON.stringify(newArrChecked));
    }
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
  const arrChecked: string[] = JSON.parse(
    localStorage.getItem('arrChecked') ?? '[]'
  );
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
                  onChange={handleCheck}
                  defaultChecked={arrChecked.includes(value)}
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
