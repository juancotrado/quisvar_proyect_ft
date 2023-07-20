import { statusText } from '../../shared/card/cardTaskInformation/constans';
import './subTaskStatusLabel.css';

interface SubTaskStatusLabelProps {
  status: keyof typeof statusText;
}

const SubTaskStatusLabel = ({ status }: SubTaskStatusLabelProps) => {
  return (
    <div className="subTaskStatusLabel-content">
      <label
        className={`subTaskStatusLabel-text subTaskStatusLabel-${status} `}
      >
        {statusText[status]}
      </label>
    </div>
  );
};

export default SubTaskStatusLabel;
