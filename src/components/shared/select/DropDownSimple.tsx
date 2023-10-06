import type { ChangeEvent, InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { container } from '../../../animations/animations';
import './dropDownSimple.css';
import Outside from '../../portal/Outside';

type typeObj = { [key: string]: any };

interface DropDownSimpleProps extends InputHTMLAttributes<HTMLInputElement> {
  data: typeObj[] | string[];
  selector?: boolean;
  textField: string;
  itemKey: string;
  defaultInput?: string;
  label?: string;
  className?: string;
  classNameInput?: string;
  droper?: boolean;
  valueInput?: (event: string, index: string) => void;
  onChangeInput?: (event: ChangeEvent<HTMLInputElement>) => void;
  deleteUser?: () => void;
}

const DropDownSimple = ({
  data,
  itemKey,
  textField,
  label,
  valueInput,
  defaultInput,
  placeholder,
  droper,
  onChangeInput,
  selector,
  className,
  classNameInput,

  deleteUser,
  ...otherProps
}: DropDownSimpleProps) => {
  const [options, setOptions] = useState<typeObj[] | null>();
  const [isActive, setIsActive] = useState(false);
  const [query, setQuery] = useState<string>(
    defaultInput !== undefined ? defaultInput : ''
  );

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

  const optionsFiltered = useMemo(
    () =>
      query
        ? options?.filter(_option =>
            _option[textField].toLowerCase().includes(query.toLowerCase())
          )
        : options,
    [options, query, textField]
  );

  const filterByQuery = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    setQuery(value);
    value.length !== 0 ? setIsActive(true) : setIsActive(false);
  };

  const toogleIsActive = () => {
    setIsActive(!isActive);
    deleteUser?.();
  };
  return (
    <Outside onClickOutside={() => setIsActive(false)}>
      <div className={`${className} dropdown-container-main`}>
        <div className="dropdown-container">
          {label && <label className="select-label">{label}</label>}
          <div className={`${classNameInput} dropdown-input-container `}>
            <input
              className={`dropdown-field`}
              placeholder={!isActive ? placeholder : 'Buscar...'}
              onClick={toogleIsActive}
              onChange={e => {
                filterByQuery(e);
                onChangeInput?.(e);
              }}
              autoComplete="off"
              value={query}
              onBlur={() => setQuery('')}
              {...otherProps}
            />
            <div onClick={toogleIsActive} className="dropdown-icon">
              <img
                src={`/svg/${droper ? 'down.svg' : 'search.svg'}`}
                alt="search"
              />
            </div>
          </div>
          {isActive && (
            <motion.ul
              variants={container}
              initial="hidden"
              animate="show"
              className={`dropdown-list-option ${
                optionsFiltered?.length === 0 && 'dropdown-none'
              }`}
            >
              {optionsFiltered?.map(item => (
                <li
                  className="dropdown-option"
                  key={item[itemKey]}
                  onClick={() => {
                    setQuery(selector ? item[textField] : '');
                    valueInput?.(item[textField], item[itemKey]);
                    setIsActive(false);
                  }}
                >
                  {item[textField]}
                </li>
              ))}
            </motion.ul>
          )}
        </div>
      </div>
    </Outside>
  );
};

export default DropDownSimple;
