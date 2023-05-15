import './TextArea.css';
import { InputHTMLAttributes } from 'react';

interface TextAreaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}
const TextArea = ({ label, ...props }: TextAreaProps) => {
  return (
    <div className="input-container">
      {label && (
        <label htmlFor="email" className="input-label">
          {label}
        </label>
      )}
      <textarea {...props} className="text-area" />
    </div>
  );
};

export default TextArea;
