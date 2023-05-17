import Eye from '/svg/eye.svg';
import './input.css';
import { InputHTMLAttributes } from 'react';

interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  col?: boolean;
}
const InputText = ({ label, ...props }: InputTextProps) => {
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
        <input {...props} className="input-area" />
        {props.type == 'password' ? (
          <img src={Eye} alt={Eye} className="input-icon" />
        ) : null}
      </div>
    </div>
  );
};

export default InputText;
