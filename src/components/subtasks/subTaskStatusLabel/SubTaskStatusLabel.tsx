import { statusText } from '../../shared/card/cardTaskInformation/constans';
import './subTaskStatusLabel.css';

interface SubTaskStatusLabelProps {
  status: string;
}

const SubTaskStatusLabel = ({ status }: SubTaskStatusLabelProps) => {
  return (
    <div className="subTaskStatusLabel-content">
      <label
        className={`subTaskStatusLabel-text subTaskStatusLabel-${status} `}
      >
        {statusText[status as keyof typeof statusText]}
      </label>
    </div>
  );
};

export default SubTaskStatusLabel;
