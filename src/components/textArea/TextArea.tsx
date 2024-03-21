import { STYLE_INPUT } from '../Input/inputDefinitions';
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
  styleInput?: number;
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
      styleInput = 1,

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
          className={`${className} ${STYLE_INPUT[styleInput]} ${
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
