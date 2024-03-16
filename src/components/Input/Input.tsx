import Eye from '/svg/eye.svg';
import EyeClose from '/svg/eyeClose.svg';
import './input.css';
import {
  InputHTMLAttributes,
  useState,
  forwardRef,
  CSSProperties,
} from 'react';
import { STYLE_INPUT } from './inputDefinitions';

interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  name?: string;
  label?: string;
  col?: boolean;
  type?: string;
  disabled?: boolean;
  classNameMain?: string;
  className?: string;
  errors?: { [key: string]: any };
  errorPosX?: number;
  errorPosY?: number;
  isRelative?: boolean;
  handleSearch?: (() => void) | boolean;
  styleInput?: number;
}

const InputText = forwardRef<HTMLInputElement, InputTextProps>(
  (
    {
      name,
      label,
      col,
      errors,
      type,
      errorPosX = 0,
      errorPosY = 0,
      disabled,
      isRelative = false,
      classNameMain,
      handleSearch,
      styleInput = 1,
      className,
      ...props
    },
    ref
  ) => {
    const [isShow, setIsShow] = useState(false);
    const viewPassword = () => setIsShow(!isShow);

    let typeAux = type;
    if (type == 'password') {
      typeAux = isShow ? 'text' : 'password';
    }
    const style: CSSProperties = {
      transform: `translate(${errorPosX}px,${errorPosY}px)`,
      position: isRelative ? 'static' : 'absolute',
    };
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

export default InputText;
