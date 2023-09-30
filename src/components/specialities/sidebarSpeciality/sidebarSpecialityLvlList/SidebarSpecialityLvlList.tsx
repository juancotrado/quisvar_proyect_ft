import { FocusEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import {
  DataSidebarSpeciality,
  typeSidebarSpecility,
} from '../../../../types/types';
import './sidebarSpecialityLvlList.css';
import DotsOption from '../../../shared/dots/DotsOption';
import { axiosInstance } from '../../../../services/axiosInstance';
import { Input } from '../../..';
import {
  validateCorrectTyping,
  validateWhiteSpace,
} from '../../../../utils/customValidatesForm';
import colors from '../../../../utils/json/colorSidebar.json';

import {
  isOpenCardRegisteProject$,
  toggle$,
} from '../../../../services/sharingSubject';
import { Subscription } from 'rxjs';

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

const INIT_VALUES: FormData = {
  name: '',
  cod: '',
};
const SidebarSpecialityLvlList = ({
  data,
  type,
  onSave,
  indexSelected,
  authUser = true,
}: SidebarSpecialityLvlListProps) => {
  const [openEditData, setOpenEditData] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>(INIT_VALUES);
  const isFirstLevel = type === 'sector';
  const isLastLevel = type === 'projects';
  const [errors, setErrors] = useState<{ [key: string]: any }>({});
  const [isClickRight, setIsClickRight] = useState(false);
  useEffect(() => {
    setFormData({ name: data.name ?? '', cod: data.cod ?? '' });
  }, [data.cod, data.name]);

  const handleToggleRef = useRef<Subscription>(new Subscription());

  useEffect(() => {
    handleToggleRef.current = toggle$.getSubject.subscribe((value: boolean) => {
      setOpenEditData(value);
    });
    return () => {
      handleToggleRef.current.unsubscribe();
    };
  }, []);

  const handleBlurInput = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (typeof validateCorrectTyping(value) === 'string') {
      setErrors({
        name: {
          message: validateCorrectTyping(value),
        },
      });
    } else if (typeof validateWhiteSpace(value) === 'string') {
      setErrors({
        name: {
          message: validateWhiteSpace(value),
        },
      });
    } else {
      setErrors({ value: '' });
      setFormData({ ...formData, [name]: value });
    }
  };
  const handleForm = () => {
    axiosInstance.put(`/${type}/${data.id}`, formData).then(() => {
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
  const handleClickRigth = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsClickRight(!isClickRight);
  };
  const handleEdit = () => {
    if (type === 'projects') {
      isOpenCardRegisteProject$.setSubject = {
        isOpen: true,
        typeSpecialityId: null,
        project: data,
      };
      return;
    }
    setOpenEditData(!openEditData);
  };
  const style = {
    borderLeft: `thick solid ${colors[type]}`,
  };
  return (
    <div className={`SidebarSpecialityLvlList-sub-list-item `} style={style}>
      <div
        className={`SidebarSpecialityLvlList-section  ${
          data.name + '-' + data.id === indexSelected &&
          'sidebarLevelList-sub-list-span-active'
        }`}
        onContextMenu={handleClickRigth}
      >
        {openEditData ? (
          <div
            className={`SidebarSpecialityLvlList-inputs`}
            onClick={e => e.stopPropagation()}
          >
            {type === 'specialities' && (
              <Input
                defaultValue={data?.cod}
                label="Nombre Cortos:"
                name="cod"
                className="SidebarSpecialityLvlList-input"
                onBlur={handleBlurInput}
                errors={errors}
              />
            )}
            <Input
              defaultValue={data.name}
              label="Nombre:"
              name="name"
              className="SidebarSpecialityLvlList-input"
              onBlur={handleBlurInput}
              errors={errors}
            />
          </div>
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
      </div>
      {!isFirstLevel && authUser && (
        <DotsOption
          notPersist={true}
          className="sidebarLevelList-menu-dots-option"
          notPositionRelative
          isClickRight={isClickRight}
          data={[
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
                ? () => handleForm()
                : () => handleDelete(data.id),
            },
          ]}
        />
      )}
    </div>
  );
};

export default SidebarSpecialityLvlList;
