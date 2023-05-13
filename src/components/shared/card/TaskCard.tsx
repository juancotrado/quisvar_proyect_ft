import icon_unresolved from '/svg/task_unresolved.svg';
import icon_process from '/svg/task_process.svg';
import icon_done from '/svg/task_done.svg';
import './taskcard.css';
import { TaskType } from '../../../types/types';
import { axiosInstance } from '../../../services/axiosInstance';

interface TaskCardProps {
  task: TaskType;
  getTasks: () => void;
}
interface BodyStatus {
  status: string;
}

const TaskCard = ({ task, getTasks }: TaskCardProps) => {
  const handleNext = () => {
    const { status } = task;
    const statusBody = {
      UNRESOLVED: {
        status: 'PROCESS',
      },
      PROCESS: {
        status: 'DONE',
      },
    };
    const body = statusBody[status as keyof typeof statusBody];
    changeStatus(body);
  };
  const handlePrevius = () => {
    const { status } = task;
    console.log(status);
    const statusBody = {
      DONE: {
        status: 'PROCESS',
      },
      PROCESS: {
        status: 'UNRESOLVED',
      },
    };
    const body = statusBody[status as keyof typeof statusBody];
    changeStatus(body);
  };

  const changeStatus = (body: BodyStatus) => {
    axiosInstance
      .patch(`/tasks/status/${task.id}`, body)
      .then(res => {
        console.log(res.data);
        getTasks();
      })
      .catch(err => console.log(err));
  };
  return (
    <div className="task-class">
      <div className="task-header-card">Unknow </div>
      <span className={`icon-card task-${task.status}`}>
        <img
          src={
            task.status === 'DONE'
              ? icon_done
              : task.status === 'PROCESS'
              ? icon_process
              : icon_unresolved
          }
          alt={task.status}
        />
      </span>
      {/* //tasks/status/id */}
      {/* {tasks && <TaskCard task={tasks} />} */}
      <div className="task-content">
        <h2>{task.name} </h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam
          cupiditate, ex quam rerum in aspernatur commodi impedit enim illum
          corrupti, distinctio sed eveniet excepturi assumenda unde? Sed enim
          consequuntur adipisci?
        </p>
        <div className="buttons">
          {(task.status == 'DONE' || task.status == 'PROCESS') && (
            <button onClick={handlePrevius}>Previus</button>
          )}
          {(task.status === 'UNRESOLVED' || task.status == 'PROCESS') && (
            <button onClick={handleNext}>Next</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
