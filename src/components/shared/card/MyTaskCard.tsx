import './mytaskcard.css';
import icon_done from '/svg/task_done.svg';
import { TaskType } from '../../../types/types';
import icon_list_task from '/svg/icon_list_task.svg';

interface TaskCardProps {
  task: TaskType;
}

const MyTaskCard = ({ task }: TaskCardProps) => {
  const { subtasks } = task;
  const initialValue = 0;
  const sumPrice = Math.round(
    subtasks.reduce((a, c) => a + c.price, initialValue)
  );
  const { employees } = task;
  const dateString = employees[0].assignedAt;
  const date =
    dateString.length > 10 ? dateString.substring(0, 10) : dateString;

  return (
    <div className="my-task-class">
      <span className={`my-icon-card`}>
        <img
          src={
            task.status === 'DONE'
              ? icon_done
              : task.status === 'PROCESS'
              ? icon_list_task
              : ''
          }
        />
      </span>
      <div className="my-task-content">
        <h2>{task.name}</h2>
        <ul>
          <h3>{task.project.name} </h3>
          {subtasks &&
            subtasks.map(subtask => (
              <li key={subtask.id}>{subtask.description}</li>
            ))}
        </ul>
      </div>
      <div className="footer-my-task">
        <span>Fecha Inicio:{date}</span>
        <span>Precio:S/{sumPrice}</span>
      </div>
    </div>
  );
};

export default MyTaskCard;
