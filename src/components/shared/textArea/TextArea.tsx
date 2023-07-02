import './TextArea.css';
import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}
const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, ...props }, ref) => {
    return (
      <div className="input-container">
        {label && (
          <label htmlFor="email" className="input-label">
            {label}
          </label>
        )}
        <textarea ref={ref} {...props} rows={5} />
      </div>
    );
  }
);

export default TextArea;
