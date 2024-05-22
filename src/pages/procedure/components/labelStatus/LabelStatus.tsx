import { MessageStatus } from '../../../../types';
import './labelStatus.css';

interface LabelStatusProps {
  status: MessageStatus;
}

const LabelStatus = ({ status }: LabelStatusProps) => {
  return (
    <div className="labelStatus-container">
      <span className={`labelStatus status-${status}`}>{status}</span>
    </div>
  );
};

export default LabelStatus;
