/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from 'framer-motion';
import Outside from '../../portal/Outside';
import { useEffect, useMemo, useState } from 'react';
import { container } from '../../../animations/animations';
type typeObj = { [key: string]: any };
interface DropDownStageProps {
  data: typeObj[] | string[];
  textField: string;
  itemKey: string;
  label?: string;
  valueInput?: (event: string, index: string) => void;
}
const DropDownStage = ({
  data,
  textField,
  itemKey,
  label,
  valueInput,
}: DropDownStageProps) => {
  const [isActive, setIsActive] = useState(false);
  const [options, setOptions] = useState<typeObj[] | null>();
  const [title, setTitle] = useState(label);
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
  };

  const toogleClose = () => {
    setIsActive(false);
  };

  const toogleSelect = (a: string, b: string) => {
    valueInput?.(a, b);
    setIsActive(false);
  };

  const optionsFiltered = useMemo(() => options, [options]);
  return (
    <Outside onClickOutside={toogleClose}>
      <div className={`dropdown-selector-container-main`}>
        <div className="dropdown-selector-container">
          <div
            className={`dropdown-selector-input-container`}
            onClick={toogleIsActive}
          >
            <span>{label ? title : 'Seleccionar'}</span>
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
                  onClick={() => {
                    toogleSelect(item[textField], item[itemKey]);
                    setTitle(item[textField]);
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

export default DropDownStage;
