import './TextArea.css';
import { CSSProperties, TextareaHTMLAttributes, forwardRef } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  name?: string;
  className?: string;
  errors?: { [key: string]: any };
  errorPosX?: number;
  errorPosY?: number;
  isRelative?: boolean;
  disabled?: boolean;
}
const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      name,
      className,
      errors,
      errorPosX = 0,
      isRelative = false,
      errorPosY = 0,
      disabled,
      ...props
    },
    ref
  ) => {
    const style: CSSProperties = {
      transform: `translate(${errorPosX}px,${errorPosY}px)`,
      position: isRelative ? 'static' : 'absolute',
    };
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
          } ${disabled && 'input-disabled'} `}
        />
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

export default TextArea;
