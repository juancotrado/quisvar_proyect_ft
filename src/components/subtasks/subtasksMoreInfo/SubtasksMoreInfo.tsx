import { SubTask } from '../../../types/types';
import './subtasksMoreInfo.css';
interface SubtasksMoreInfoProps {
  task: SubTask;
}
const SubtasksMoreInfo = ({ task }: SubtasksMoreInfoProps) => {
  return (
    <div className="subtasksMoreInfo">
      <div className="subtasksMoreInfo-item"></div>
    </div>
  );
};

export default SubtasksMoreInfo;
