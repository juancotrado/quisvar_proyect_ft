import Eye from '/svg/eye.svg';
import EyeClose from '/svg/eyeClose.svg';
import './input.css';
import { InputHTMLAttributes, useState } from 'react';
import { forwardRef } from 'react';

interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  name?: string;
  label?: string;
  col?: boolean;
  type?: string;
  disabled?: boolean;
  errors?: { [key: string]: any };
}

const InputText = forwardRef<HTMLInputElement, InputTextProps>(
  ({ name, label, col, errors, type, disabled, ...props }, ref) => {
    const [isShow, setIsShow] = useState(false);
    const viewPassword = () => setIsShow(!isShow);

    let typeAux = type;
    if (type == 'password') {
      typeAux = isShow ? 'text' : 'password';
    }
    return (
      <div className={`input-main ${col && 'input-col'}`}>
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
            className={`input-area ${
              errors && name && errors[name] && 'input-area-error'
            } ${disabled && 'input-disabled'}`}
            disabled={disabled}
            ref={ref}
            type={typeAux}
            {...props}
          />
          {type == 'password' ? (
            <img
              onClick={viewPassword}
              src={isShow ? Eye : EyeClose}
              alt={Eye}
              className="input-icon"
            />
          ) : null}
        </div>
        {name && errors && errors[name] && (
          <span className="input-span-error">
            <img
              src="/svg/warning.svg"
              alt="warning"
              className="input-span-icon"
            />
            {errors[name]?.type === 'required'
              ? 'Por favor llene el campo.'
              : // : `Formato de ${label} invalido.`
                errors[name].message}
            {/* {errors[name] && <span>El campo solo puede tener letras o numeros</span>} */}
          </span>
        )}
      </div>
    );
  }
);

export default InputText;
