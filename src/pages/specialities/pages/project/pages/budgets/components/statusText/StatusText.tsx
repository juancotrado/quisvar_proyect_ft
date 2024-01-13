import { statusText } from '../../../../../../../../components/shared/card/cardTaskInformation/constans';
import './statusText.css';
import { StatusType } from '../../../../../../../../types/types';
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
      {statusText[status]}
    </div>
  );
};

export default StatusText;
