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
import { AreaForm } from '../../../types/types';
import { axiosInstance } from '../../../services/axiosInstance';
import { useNavigate } from 'react-router-dom';

type typeObj = { [key: string]: any };

interface DropDownSelectorProps {
  data: typeObj[] | string[];
  textField: string;
  itemKey: string;
  label?: string;
  post?: string;
  valuesQuery?: { [key: string]: string | number | boolean };
  defaultInput?: string;
  valueInput?: (event: string, index: string) => void;
  onSave?: () => void;
}

const DropDownSelector = ({
  data,
  textField,
  itemKey,
  defaultInput,
  label,
  valueInput,
  post,
  valuesQuery,
  onSave,
}: DropDownSelectorProps) => {
  const { userSession } = useSelector((state: RootState) => state);
  const navigate = useNavigate();
  const role = userSession?.role ? userSession.role : 'EMPLOYEE';
  const { handleSubmit, register, reset } = useForm<Pick<AreaForm, 'name'>>();
  const [isActive, setIsActive] = useState(false);
  const [addArea, setAddArea] = useState(false);
  const [options, setOptions] = useState<typeObj[] | null>();
  const [query, setQuery] = useState<string>(
    defaultInput !== undefined ? defaultInput : ''
  );

  const optionsFiltered = useMemo(
    () =>
      query
        ? options?.filter(_option =>
            _option[textField].toLowerCase().includes(query.toLowerCase())
          )
        : options,
    [options, query, textField]
  );

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
    },
    {
      name: 'Descartar',
      function: () => {
        setAddArea(false);
        reset();
      },
      type: 'reset',
    },
  ];

  const handleDelete = async (id: number) => {
    return await axiosInstance.delete(`/${post}/${id}`).then(() => {
      toogleClose();
      onSave?.();
    });
  };
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
                    setIsActive(false);
                  }}
                >
                  <span onClick={() => navigate(`/tareas/${item[itemKey]}`)}>
                    {item[textField]}
                  </span>
                  {role !== 'EMPLOYEE' && (
                    <DotsOption
                      data={[
                        {
                          name: 'eliminar',
                          function: () => handleDelete(item[itemKey]),
                        },
                      ]}
                    />
                  )}
                </li>
              ))}
              {post && (
                <li className="dropdown-element-add ">
                  <form
                    onClick={e => e.stopPropagation()}
                    onSubmit={handleSubmit(onSubmitArea)}
                    className="dropdown-element-add "
                  >
                    {addArea ? (
                      <>
                        <Input
                          {...register('name')}
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
