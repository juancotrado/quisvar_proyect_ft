import { URL } from '../../../../services/axiosInstance';
import './chipFileMessage.css';

interface ChipFileMessageProps {
  text: string;
  link?: string;
  onClose?: () => void;
  onClick?: () => void;
  className?: string;
}
const ChipFileMessage = ({
  text,
  onClick,
  onClose,
  link,
  className,
}: ChipFileMessageProps) => {
  const icon = text.includes('.xlsx')
    ? 'file-excel'
    : text.includes('.pdf')
    ? 'pdf-icon'
    : text.includes('.zip')
    ? 'file-zipper'
    : text.includes('.rar')
    ? 'file-zipper'
    : text.includes('.docx')
    ? 'file-word'
    : 'file-upload';

  const parseLink = 'file-user/' + link?.split('/').slice(1).join('/');
  const dir = `${URL}/${parseLink}`;
  return (
    <div className={`${className} chip-container-file `} onClick={onClick}>
      <a target="_blank" href={link && dir} className="chip-file-link">
        <div className="chip-file-information">
          <img className="chip-file-icon-doc" src={`/svg/${icon}.svg`} />
          <span className="chip-file-text">{text}</span>
        </div>
        {onClose && (
          <img
            className="chip-file-icon-close"
            onClick={onClose}
            src="/svg/close.svg"
          />
        )}
      </a>
    </div>
  );
};

export default ChipFileMessage;
