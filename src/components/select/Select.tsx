import { StylesVariant } from '../../types';
import './Select.css';
import { CSSProperties, SelectHTMLAttributes, forwardRef } from 'react';
import { STYLE_SELECT } from './selectDefinitions';

interface SelectOptionsProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  data?: { [key: string]: any }[];
  itemKey: string;
  textField: string;
  name: string;
  errors?: { [key: string]: any };
  errorPosX?: number;
  errorPosY?: number;
  placeholder?: string;
  isRelative?: boolean;
  styleVariant?: StylesVariant;
  className?: string;
}
export const SelectOptions = forwardRef<HTMLSelectElement, SelectOptionsProps>(
  (
    {
      label,
      data,
      itemKey,
      textField,
      name,
      errorPosX = 0,
      errorPosY = 0,
      errors,
      defaultValue,
      isRelative = false,
      className,
      placeholder,
      styleVariant = 'secondary',
      ...props
    },
    ref
  ) => {
    const style: CSSProperties = {
      transform: `translate(${errorPosX}px,${errorPosY}px)`,
      position: isRelative ? 'static' : 'absolute',
    };
    return (
      <div className="select-container">
        {label && (
          <label htmlFor="email" className="select-label">
            {label}
          </label>
        )}
        <select
          className={`${STYLE_SELECT[styleVariant]} ${className}`}
          {...props}
          ref={ref}
          defaultValue={defaultValue}
          name={name}
        >
          <option value={''}>{`${
            placeholder ? placeholder : 'Seleccionar'
          }`}</option>
          {data?.map(element => (
            <option key={element[itemKey]} value={element[itemKey]}>
              {element[textField]}
            </option>
          ))}
        </select>
        {name && errors && errors[name] && (
          <span className="input-span-error" style={style}>
            <img
              src="/svg/warning.svg"
              alt="warning"
              className="input-span-icon"
            />
            {errors[name]?.type === 'required'
              ? 'Por favor llene el campo.'
              : errors[name].message}
          </span>
        )}
      </div>
    );
  }
);

export default SelectOptions;
