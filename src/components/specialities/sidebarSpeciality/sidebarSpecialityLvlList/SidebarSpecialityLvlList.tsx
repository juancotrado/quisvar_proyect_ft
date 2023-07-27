import { FocusEvent, useEffect, useState } from 'react';
import {
  DataSidebarSpeciality,
  typeSidebarSpecility,
} from '../../../../types/types';
import './sidebarSpecialityLvlList.css';
import DotsOption from '../../../shared/dots/DotsOption';
import { axiosInstance } from '../../../../services/axiosInstance';
import { Input } from '../../..';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import {
  validateCorrectTyping,
  validateWhiteSpace,
} from '../../../../utils/customValidatesForm';

interface SidebarSpecialityLvlListProps {
  data: DataSidebarSpeciality;
  type: typeSidebarSpecility;
  onSave?: () => void;
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
}: SidebarSpecialityLvlListProps) => {
  const [openEditData, setOpenEditData] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>(INIT_VALUES);
  const isFirstLevel = type === 'sector';
  const isLastLevel = type === 'typespecialities';
  const { role } = useSelector((state: RootState) => state.userSession);
  const [errors, setErrors] = useState<{ [key: string]: any }>({});
  useEffect(() => {
    if (isLastLevel) {
      setFormData({ name: data.name || '' });
    }
  }, [data.name, isLastLevel]);

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
  const handleForm = async () => {
    await axiosInstance.put(`/${type}/${data.id}`, formData);
    setOpenEditData(false);
    onSave?.();
  };
  const handleDelete = async (id: number) => {
    setOpenEditData(false);
    await axiosInstance.delete(`/${type}/${id}`);
    onSave?.();
  };

  return (
    <div
      className={`SidebarSpecialityLvlList-sub-list-item ${
        isFirstLevel && 'not-border-left'
      }`}
    >
      <div className="SidebarSpecialityLvlList-section">
        {isFirstLevel && (
          <img
            src="/svg/reports.svg"
            alt="reportes"
            className="SidebarSpecialityLvlList-icon"
          />
        )}
        {openEditData ? (
          <div
            className="SidebarSpecialityLvlList-inputs"
            onClick={e => e.stopPropagation()}
          >
            <Input
              defaultValue={data.name}
              label="Nombre:"
              name="name"
              className="SidebarSpecialityLvlList-input"
              onBlur={handleBlurInput}
              errors={errors}
            />
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
              </span>{' '}
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
                  defaultChecked
                />
              </>
            )}
          </>
        )}
      </div>
      {!isFirstLevel && role !== 'EMPLOYEE' && (
        <DotsOption
          className="sidebarLevelList-menu-dots-option"
          notPositionRelative
          data={[
            {
              name: openEditData ? 'Cancelar' : 'Editar',
              type: openEditData ? 'submit' : 'button',
              icon: openEditData ? 'close' : 'pencil',
              function: () => {
                setOpenEditData(!openEditData);
              },
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
