import { FocusEvent, MouseEvent, useEffect, useState } from 'react';
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
import { isOpenCardRegisteProject$ } from '../../../../services/sharingSubject';

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
  return (
    <div
      className={`SidebarSpecialityLvlList-sub-list-item ${
        isFirstLevel && 'not-border-left'
      }`}
    >
      <div
        className={`SidebarSpecialityLvlList-section  ${
          data.name + '-' + data.id === indexSelected &&
          'sidebarLevelList-sub-list-span-active'
        }`}
        onContextMenu={handleClickRigth}
      >
        {isFirstLevel && (
          <img
            src="/svg/reports.svg"
            alt="reportes"
            className="SidebarSpecialityLvlList-icon"
          />
        )}
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
            <h4
              className={`SidebarSpecialityLvlList-sub-list-name  ${
                isFirstLevel && 'not-margin-left'
              } ${isLastLevel && 'letter-small'}   `}
            >
              <span className="SidebarSpecialityLvlList-sub-list-span">
                {data.cod && `${data.cod} `}
              </span>
              {data.name}
            </h4>
            {!isLastLevel && (
              <>
                <img
                  src="/svg/down.svg"
                  className="SidebarSpecialityLvlList-dropdown-arrow"
                />
                <input
                  type="checkbox"
                  className="SidebarSpecialityLvlList-dropdown-check"
                  defaultChecked={false}
                />
                {/* {!!data.specialities?.length ||
                   !!data.typeSpecialities?.length} */}
              </>
            )}
          </>
        )}
      </div>
      {!isFirstLevel && authUser && (
        <DotsOption
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
