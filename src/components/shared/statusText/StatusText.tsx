import { statusText } from '../card/cardTaskInformation/constans';
import './statusText.css';
import { StatusType } from '../../../types/types';
interface StatusTextProps {
  status: StatusType;
}

const StatusText = ({ status }: StatusTextProps) => {
  return <div className={`statusText  ${status}`}>{statusText[status]}</div>;
};

export default StatusText;
