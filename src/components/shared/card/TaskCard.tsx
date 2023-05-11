import icon_unresolved from '../../../../public/svg/task_unresolved.svg';
import icon_process from '../../../../public/svg/task_process.svg';
import icon_done from '../../../../public/svg/task_done.svg';
import './taskcard.css';

export type taskData = {
  id: number;
  title: string;
  area: string;
  description?: string;
  status: 'UNRESOLVED' | 'PROCESS' | 'DONE';
};
interface TaskCard {
  data: taskData;
}

const TaskCard = ({ data }: TaskCard) => {
  return (
    <div className="task-class">
      <div className="task-header-card">{data.area} </div>
      <span className={`icon-card task-${data.status.toLowerCase()}`}>
        <img
          src={
            data.status === 'DONE'
              ? icon_done
              : data.status === 'PROCESS'
              ? icon_process
              : icon_unresolved
          }
          alt={data.status}
        />
      </span>
      <div className="task-content">
        <h2>{data.title} </h2>
        <p>{data.description}</p>
      </div>
    </div>
  );
};

export default TaskCard;
