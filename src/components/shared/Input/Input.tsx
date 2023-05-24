import Eye from '/svg/eye.svg';
import './input.css';
import { InputHTMLAttributes, LegacyRef, forwardRef } from 'react';

interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  col?: boolean;
  defaultValue?: any;
}
const InputText = forwardRef(
  (
    { name, label, defaultValue, ...props }: InputTextProps,
    ref: LegacyRef<HTMLInputElement>
  ) => {
    return (
      <div className={`${props.col ? 'input-col' : 'input-container'}`}>
        {label && (
          <label
            htmlFor="email"
            className={`${props.col ? 'input-label-col' : 'input-label'}`}
          >
            {label}
          </label>
        )}
        <div className={`${props.col ? 'input-option-col' : 'input-option'}`}>
          <input
            {...props}
            name={name}
            className="input-area"
            ref={ref}
            defaultValue={defaultValue}
          />
          {props.type == 'password' ? (
            <img src={Eye} alt={Eye} className="input-icon" />
          ) : null}
        </div>
      </div>
    );
  }
);

export default InputText;
