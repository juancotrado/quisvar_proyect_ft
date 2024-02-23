import './statusText.css';
import { StatusType } from '../../../../../../../../types/types';
import { STATUS_TEXT } from '../../models';
interface StatusTextProps {
  status: StatusType;
  onClick?: () => void;
}

export const StatusText = ({ status, onClick }: StatusTextProps) => {
  return (
    <div
      onClick={onClick}
      className={`statusText  ${status} ${onClick && 'statusText-cursor'}`}
    >
      {STATUS_TEXT[status]}
    </div>
  );
};

export default StatusText;
