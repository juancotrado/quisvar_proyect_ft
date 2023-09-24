import './TextArea.css';
import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  name?: string;
  className?: string;
  errors?: { [key: string]: any };
}
const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, name, className, errors, ...props }, ref) => {
    return (
      <div className="input-container">
        {label && (
          <label htmlFor={name} className="input-label">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          {...props}
          name={name}
          className={`${className} input-container-textarea ${
            errors && name && errors[name] && 'input-text-area-error'
          }`}
        />
        {name && errors && errors[name] && (
          <span className="input-span-error">
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

export default TextArea;
