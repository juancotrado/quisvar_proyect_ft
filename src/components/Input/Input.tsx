import Eye from '/svg/eye.svg';
import EyeClose from '/svg/eyeClose.svg';
import './input.css';
import { InputHTMLAttributes, useState, forwardRef, ForwardedRef } from 'react';
import { STYLE_INPUT } from './inputDefinitions';
import { FieldErrors, FieldValues, Path } from 'react-hook-form';
import { InputErrorInfo } from '../inputErrorInfo';

interface InputTextProps<FormData extends FieldValues>
  extends InputHTMLAttributes<HTMLInputElement> {
  name?: Path<FormData>;
  label?: string;
  col?: boolean;
  classNameMain?: string;
  errors?: FieldErrors<FormData>;
  errorPosX?: number;
  errorPosY?: number;
  errorRelative?: boolean;
  handleSearch?: (() => void) | boolean;
  styleInput?: number;
}

const InputText = forwardRef(
  <FormData extends FieldValues>(
    {
      name,
      label,
      col,
      errors,
      type,
      errorPosX = 0,
      errorPosY = 0,
      disabled,
      errorRelative = false,
      classNameMain,
      handleSearch,
      styleInput = 2,
      className,
      ...props
    }: InputTextProps<FormData>,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const [isShow, setIsShow] = useState(false);
    const viewPassword = () => setIsShow(!isShow);

    let typeAux = type;
    if (type === 'password') {
      typeAux = isShow ? 'text' : 'password';
    }

    return (
      <div className={`input-main ${col && 'input-col'} ${classNameMain}`}>
        {label && (
          <label
            htmlFor={name}
            className={`${col ? 'input-label-col' : 'input-label'}`}
          >
            {label}
          </label>
        )}
        <div className={`${col ? 'input-option-col' : 'input-option'}`}>
          <input
            name={name}
            id={name}
            className={` ${STYLE_INPUT[styleInput]} ${
              errors && name && errors[name] && 'input-area-error'
            } ${disabled && 'input-disabled'} ${
              (type == 'password' || handleSearch) && 'input-pading-right'
            } ${className}`}
            disabled={disabled}
            ref={ref}
            type={typeAux}
            {...props}
          />
          {type == 'password' && (
            <img
              onClick={viewPassword}
              src={isShow ? Eye : EyeClose}
              alt={Eye}
              className="input-icon"
            />
          )}
          {handleSearch && typeof handleSearch === 'function' && (
            <img
              onClick={handleSearch}
              src={'/svg/ic_baseline-search.svg'}
              className="input-icon"
            />
          )}
        </div>
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
  }
);

export default InputText;
