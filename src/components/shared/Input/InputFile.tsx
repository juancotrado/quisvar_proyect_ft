import {
  useRef,
  useState,
  DragEvent,
  ChangeEvent,
  InputHTMLAttributes,
} from 'react';
import './inputFile.css';

interface InputFileProps extends InputHTMLAttributes<HTMLInputElement> {
  getFiles?: (files: FileList) => void;
  getFilesList?: (files: File[]) => void;
  label?: string;
  className?: string;
}

const InputFile = ({
  getFiles,
  getFilesList,
  label,
  className,
  ...props
}: InputFileProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (event: DragEvent<HTMLDivElement | HTMLFormElement>) => {
    event.stopPropagation();
    event.preventDefault();
    const { type } = event;
    if (type === 'dragenter' || type === 'dragover') {
      setDragActive(true);
    } else if (type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    const { files } = event.dataTransfer;
    if (files?.[0]) handleFile(files);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const { files } = event.target;
    if (files?.[0]) handleFile(files);
  };

  const handleInputRef = () => inputRef.current?.click();

  const handleFile = (files: FileList) => {
    setFileName(files[0].name);
    getFiles?.(files);
    if (files) {
      const fileList = Array.from(files);
      getFilesList?.(fileList);
    }
  };

  return (
    <div className={`container-file-upload`} onDragEnter={handleDrag}>
      {label && (
        <div className="container-label-upload">
          <label htmlFor={label}>{label}</label>
        </div>
      )}
      <input
        type="file"
        // accept=".doc,.docx"
        className="input-file-upload"
        ref={inputRef}
        multiple={true}
        onChange={handleInputChange}
        {...props}
      />
      <label className={`${className} label-file-upload`} htmlFor={label}>
        <div>
          {/* <p>{fileName ? fileName : 'Arrastra o Selecciona un archivo'} </p> */}
          <p>{'Cargue o Arrastra un archivo'} </p>
          <button
            className="upload-button"
            type="button"
            onClick={handleInputRef}
          >
            Subir archivo
          </button>
        </div>
      </label>
      {dragActive && (
        <div
          className="drag-file-element"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        ></div>
      )}
    </div>
  );
};

export default InputFile;
