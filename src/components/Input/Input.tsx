import Eye from '/svg/eye.svg';
import EyeClose from '/svg/eyeClose.svg';
import './input.css';
import { InputHTMLAttributes, useState } from 'react';
import { STYLE_INPUT } from './inputDefinitions';
import { InputErrorInfo } from '../inputErrorInfo';
import { FieldErrors, FieldValues, Path } from 'react-hook-form';

interface InputTextProps<FormData extends FieldValues>
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  col?: boolean;
  type?: string;
  disabled?: boolean;
  classNameMain?: string;
  className?: string;
  errors: FieldErrors<FormData>;
  name: Path<FormData>;
  errorPosX?: number;
  errorPosY?: number;
  errorRelative?: boolean;
  handleSearch?: (() => void) | boolean;
  styleInput?: number;
}

//const InputText = forwardRef<HTMLInputElement, InputTextProps<FormData extends FieldValues>>(
const InputText = <FormData extends FieldValues>({
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
}: InputTextProps<FormData>) => {
  const [isShow, setIsShow] = useState(false);
  const viewPassword = () => setIsShow(!isShow);

  let typeAux = type;
  if (type == 'password') {
    typeAux = isShow ? 'text' : 'password';
  }
  // const style: CSSProperties = {
  //   transform: `translate(${errorPosX}px,${errorPosY}px)`,
  //   position: isRelative ? 'static' : 'absolute',
  // };
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
          }`}
          disabled={disabled}
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
};

export default InputText;
