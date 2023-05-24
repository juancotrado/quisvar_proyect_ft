import Eye from '/svg/eye.svg';
import './input.css';
import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  name?: string;
  label?: string;
  col?: boolean;
  errors?: any;
}

const InputText = forwardRef<HTMLInputElement, InputTextProps>(
  ({ name, label, col, errors, ...props }, ref) => {
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
              errors && errors[name] && 'input-area-error'
            }`}
            ref={ref}
            {...props}
          />
          {props.type == 'password' ? (
            <img src={Eye} alt={Eye} className="input-icon" />
          ) : null}
        </div>
        {errors && errors[name] && (
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
