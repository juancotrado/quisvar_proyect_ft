import Eye from '/svg/eye.svg';
import './input.css';
import { InputHTMLAttributes } from 'react';

interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}
const InputText = ({ label, ...props }: InputTextProps) => {
  return (
    <div className="input-container">
      {label && (
        <label htmlFor="email" className="input-label">
          {label}
        </label>
      )}
      <div className="input-option">
        <input {...props} className="input-area" />
        {props.type == 'password' ? (
          <img src={Eye} alt={Eye} className="input-icon" />
        ) : null}
      </div>
    </div>
  );
};

export default InputText;
