import { useEffect, useMemo, useState } from 'react';
import Outside from '../../portal/Outside';
import { motion } from 'framer-motion';
import { container } from '../../../animations/animations';
import './dropDownSelector.css';
import DotsOption, { Option } from '../dots/DotsOption';
import { RootState } from '../../../store';
import { useSelector } from 'react-redux';
import { Input } from '../..';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AreaForm, Report } from '../../../types/types';
import { axiosInstance } from '../../../services/axiosInstance';
import { useNavigate } from 'react-router-dom';
import useArchiver from '../../../hooks/useArchiver';
import {
  validateCorrectTyping,
  validateWhiteSpace,
} from '../../../utils/customValidatesForm';
import { excelSimpleReport } from '../../../utils/generateExcel';
import formatDate from '../../../utils/formatDate';

type typeObj = { [key: string]: any };

interface DropDownSelectorProps {
  data: typeObj[] | string[];
  textField: string;
  itemKey: string;
  label?: string;
  post?: string;
  navigateRoute: string;
  valuesQuery?: { [key: string]: string | number | boolean };
  defaultInput?: string;
  valueInput?: (event: string, index: string) => void;
  onSave?: () => void;
}

const LabelChip = ({
  valuesQuery,
  navigateRoute,
  defaultValue,
  itemKey,
  update,
  onDelete,
  onSave,
}: Pick<DropDownSelectorProps, 'navigateRoute'> & {
  defaultValue: string;
  itemKey: number;
  update?: string;
  valuesQuery?: { [key: string]: string | number | boolean };
  onDelete?: () => void;
  onSave?: () => void;
}) => {
  const [isEditable, setIsEditable] = useState(false);
  const { userSession } = useSelector((state: RootState) => state);
  const role = userSession?.role ? userSession.role : 'EMPLOYEE';
  const navigate = useNavigate();
  const { handleSubmit, register } = useForm<Pick<AreaForm, 'name'>>();
  const { handleArchiver } = useArchiver(itemKey, 'routes');
  const handleReports = () => {
    // console.log('areaId', itemKey);

    axiosInstance.get(`projects/price/${valuesQuery?.projectId}`).then(res => {
      const { department, district, province, startDate, untilDate, ...data } =
        res.data;
      const initialDate = formatDate(new Date(startDate), {
        day: 'numeric',
        weekday: 'long',
        month: 'long',
        year: 'numeric',
      });
      const finishDate = formatDate(new Date(untilDate), {
        day: 'numeric',
        weekday: 'long',
        month: 'long',
        year: 'numeric',
      });

      const findArea = data.areas.find((area: Report) => area.id === itemKey);
      const { firstName, lastName } = findArea.user.profile;
      const infoData = {
        department,
        district,
        province,
        initialDate,
        finishDate,
        fullName: firstName + ' ' + lastName,
      };
      excelSimpleReport(findArea, infoData, 'indexTasks');
    });
  };

  const onSubmitEditArea: SubmitHandler<Pick<AreaForm, 'name'>> = values => {
    axiosInstance.put(`/${update}/${itemKey}`, values).then(() => {
      onSave?.();
      setIsEditable(false);
    });
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmitEditArea)}
      className="label-chip-form "
    >
      {isEditable ? (
        <>
          <Input
            defaultValue={defaultValue}
            {...register('name')}
            name="name"
            className="dropdown-input-add"
          />
        </>
      ) : (
        <span
          className="dropdown-span"
          onClick={() => {
            navigate(`/${navigateRoute}/${itemKey}`);
          }}
        >
          {defaultValue}
        </span>
      )}
      {!['EMPLOYEE', 'MOD'].includes(role) && (
        <DotsOption
          data={[
            {
              name: isEditable ? 'Guardar' : 'Eliminar',
              function: isEditable ? () => null : () => onDelete?.(),
              icon: isEditable ? 'save' : 'trash-red',
              type: isEditable ? 'submit' : 'button',
            },
            {
              name: isEditable ? 'Cancelar' : 'Editar',
              function: () => setIsEditable(!isEditable),
              icon: isEditable ? 'close' : 'pencil',
              type: 'button',
            },
            {
              name: 'Comprimir',
              type: 'button',
              icon: 'file-zipper',
              function: handleArchiver,
            },
            {
              name: 'Reporte',
              type: 'button',
              icon: 'file-zipper',
              function: handleReports,
            },
          ]}
        />
      )}
    </form>
  );
};

const DropDownSelector = ({
  data,
  textField,
  itemKey,
  label,
  navigateRoute,
  valueInput,
  post,
  valuesQuery,
  onSave,
}: DropDownSelectorProps) => {
  const { handleSubmit, register, reset } = useForm<Pick<AreaForm, 'name'>>();
  const [isActive, setIsActive] = useState(false);
  const [addArea, setAddArea] = useState(false);
  const [options, setOptions] = useState<typeObj[] | null>();
  const { userSession } = useSelector((state: RootState) => state);
  const role = userSession?.role ? userSession.role : 'EMPLOYEE';

  const optionsFiltered = useMemo(() => options, [options]);

  const onSubmitArea: SubmitHandler<Pick<AreaForm, 'name'>> = values => {
    const _data = { ...valuesQuery, ...values };
    axiosInstance.post(`/${post}`, _data).then(() => {
      toogleClose();
      onSave?.();
    });
  };

  useEffect(() => {
    if (data !== undefined) {
      const transformData = data.map((_item, index) => {
        if (typeof _item === 'string') {
          return { [`${itemKey}`]: index.toString(), [`${textField}`]: _item };
        } else {
          return _item;
        }
      });
      setOptions(transformData);
    }
  }, [data, itemKey, textField]);

  const toogleIsActive = () => {
    setIsActive(!isActive);
    setAddArea(false);
  };

  const toogleClose = () => {
    setIsActive(false);
    setAddArea(false);
  };

  const optionListCreate: Option[] = [
    {
      name: 'Guardar',
      type: 'submit',
      icon: 'save',
    },
    {
      name: 'Descartar',
      function: () => {
        setAddArea(false);
        reset();
      },
      type: 'reset',
      icon: 'trash-red',
    },
  ];

  const handleDelete = async (id: number) => {
    return await axiosInstance.delete(`/${post}/${id}`).then(() => {
      toogleClose();
      onSave?.();
    });
  };
  console.log(!['EMPLOYEE', 'MOD'].includes(role));

  return (
    <Outside onClickOutside={toogleClose}>
      <div className={`dropdown-selector-container-main`}>
        <div className="dropdown-selector-container">
          <div
            className={`dropdown-selector-input-container`}
            onClick={toogleIsActive}
          >
            <span>{label ? label : 'Seleccionar'}</span>
            <div
              className={`dropdown-selector-icon ${
                isActive && 'caret-selector'
              }`}
            >
              <img src="/svg/down-white.svg" alt="search" />
            </div>
          </div>
          {isActive && (
            <motion.ul
              variants={container}
              initial="hidden"
              animate="show"
              className={`dropdown-selector-list-option `}
            >
              {optionsFiltered?.map(item => (
                <li
                  key={item[itemKey]}
                  className="dropdown-element-list "
                  onClick={e => {
                    e.stopPropagation();
                    valueInput?.(item[textField], item[itemKey]);
                  }}
                >
                  <LabelChip
                    onDelete={() => {
                      handleDelete(item[itemKey]);
                    }}
                    update={post}
                    navigateRoute={navigateRoute}
                    defaultValue={`${item[textField]}`}
                    valuesQuery={valuesQuery}
                    itemKey={item[itemKey]}
                    onSave={() => onSave?.()}
                  />
                </li>
              ))}
              {post && !['EMPLOYEE', 'MOD'].includes(role) && (
                <li className="dropdown-element-add ">
                  <form
                    onClick={e => e.stopPropagation()}
                    onSubmit={handleSubmit(onSubmitArea)}
                    className="dropdown-element-add "
                  >
                    {addArea ? (
                      <>
                        <Input
                          {...register('name', {
                            validate: {
                              validateWhiteSpace,
                              validateCorrectTyping,
                            },
                          })}
                          name="name"
                          className="dropdown-input-add"
                        />
                        <DotsOption data={optionListCreate} />
                      </>
                    ) : (
                      <span
                        className="add-area-span"
                        onClick={() => setAddArea(true)}
                      >
                        Añadir más +
                      </span>
                    )}
                  </form>
                </li>
              )}
            </motion.ul>
          )}
        </div>
      </div>
    </Outside>
  );
};

export default DropDownSelector;
