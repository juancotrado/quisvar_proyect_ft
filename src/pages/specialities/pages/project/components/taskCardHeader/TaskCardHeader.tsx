import { useContext } from 'react';
import { TaskContext } from '../taskCard/TaskCard';
import './taskCardHeader.css';
import { PiPowerBold } from 'react-icons/pi';
import { COLOR_CSS } from '../../../../../../utils/cssData';
import { PiClockCounterClockwiseFill } from 'react-icons/pi';

const TaskCardHeader = () => {
  const { task } = useContext(TaskContext);

  return (
    <div className="TaskCardHeader">
      <h4 className="TaskCardHeader-title">
        Título de la tarea:{' '}
        <span className="TaskCardHeader-title-span">
          {task.item} {task.name}
        </span>
      </h4>
      <div className="TaskCardHeader-actions">
        <PiClockCounterClockwiseFill color={COLOR_CSS.secondary} size={21} />
        <PiPowerBold color={COLOR_CSS.danger} size={21} />
      </div>
    </div>
  );
};

export default TaskCardHeader;
