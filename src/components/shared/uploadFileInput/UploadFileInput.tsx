import { InputHTMLAttributes } from 'react';
import './uploadFileInput.css';

interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  subName: string;
}
const UploadFileInput = ({ name, subName, ...props }: InputTextProps) => {
  return (
    <div className={`UploadFileInput-file-area `}>
      <input type="file" className="UploadFileInput-file-input" {...props} />
      <div className="UploadFileInput-file-moreInfo">
        <div className="UploadFileInput-file-btn">{name}</div>
        <p className="UploadFileInput-file-text">{subName}</p>
      </div>
    </div>
  );
};

export default UploadFileInput;
