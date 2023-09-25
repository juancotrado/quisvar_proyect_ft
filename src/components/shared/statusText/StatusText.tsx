import { statusText } from '../card/cardTaskInformation/constans';
import './statusText.css';
import { StatusType } from '../../../types/types';
interface StatusTextProps {
  status: StatusType;
  onClick?: () => void;
}

const StatusText = ({ status, onClick }: StatusTextProps) => {
  return (
    <div
      onClick={onClick}
      className={`statusText  ${status} ${onClick && 'statusText-cursor'}`}
    >
      {statusText[status]}
    </div>
  );
};

export default StatusText;
