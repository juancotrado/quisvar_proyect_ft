import Eye from '/svg/eye.svg';
import './input.css';
import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  name?: string;
  label?: string;
  col?: boolean;
}

const InputText = forwardRef<HTMLInputElement, InputTextProps>(
  ({ name, label, col, ...props }, ref) => {
    return (
      <div className={`${col ? 'input-col' : 'input-container'}`}>
        {label && (
          <label
            htmlFor="email"
            className={`${col ? 'input-label-col' : 'input-label'}`}
          >
            {label}
          </label>
        )}
        <div className={`${col ? 'input-option-col' : 'input-option'}`}>
          <input name={name} className="input-area" ref={ref} {...props} />
          {props.type == 'password' ? (
            <img src={Eye} alt={Eye} className="input-icon" />
          ) : null}
        </div>
      </div>
    );
  }
);

export default InputText;
