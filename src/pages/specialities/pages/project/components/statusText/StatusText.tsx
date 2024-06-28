import './statusText.css';
import { STATUS_TEXT } from '../../pages/budgets/models';
import { TaskStatus } from '../../models';
interface StatusTextProps {
  status: TaskStatus;
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
