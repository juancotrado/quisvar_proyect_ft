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
  errors?: { [key: string]: any };
}

const InputText = forwardRef<HTMLInputElement, InputTextProps>(
  ({ name, label, col, errors, type, ...props }, ref) => {
    const [isShow, setIsShow] = useState(false);
    const viewPassword = () => setIsShow(!isShow);

    let typeAux = type;
    if (type == 'password') {
      typeAux = isShow ? 'text' : 'password';
    }
    console.log(isShow);
    return (
      <div className={`${col ? 'input-col' : 'input-container'}`}>
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
            }`}
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
              : `Formato de ${label} invalido.`}
          </span>
        )}
      </div>
    );
  }
);

export default InputText;
