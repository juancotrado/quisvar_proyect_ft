import './Select.css';
import { StylesVariant } from '../../types';
import { ForwardedRef, SelectHTMLAttributes, forwardRef } from 'react';
import { STYLE_SELECT } from './selectDefinitions';
import { InputErrorInfo } from '../inputErrorInfo';
import { FieldErrors, FieldValues, Path } from 'react-hook-form';

interface SelectOptionsProps<
  T extends Record<string, any>,
  FormData extends FieldValues
> extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  data?: T[];
  itemKey: keyof T;
  textField: keyof T;
  name?: Path<FormData>;
  errors?: FieldErrors<FormData>;
  errorPosX?: number;
  errorPosY?: number;
  placeholder?: string;
  errorRelative?: boolean;
  styleVariant?: StylesVariant;
}
export const SelectOptions = forwardRef(function <
  T extends Record<string, any>,
  FormData extends FieldValues
>(
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
    errorRelative = false,
    className,
    placeholder,
    styleVariant = 'secondary',
    ...props
  }: SelectOptionsProps<T, FormData>,
  ref: ForwardedRef<HTMLSelectElement>
) {
  return (
    <div className="select-container">
      {label && (
        <label htmlFor="email" className="input-label">
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
        <InputErrorInfo
          errors={errors}
          name={name}
          isRelative={errorRelative}
          errorPosX={errorPosX}
          errorPosY={errorPosY}
        />
      )}
    </div>
  );
});

export default SelectOptions;
