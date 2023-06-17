import './mytaskcard.css';
import icon_done from '/svg/task_done.svg';
import { SubtaskIncludes } from '../../../types/types';
import icon_list_task from '/svg/icon_list_task.svg';
import { _date } from '../../../utils/formatDate';
import { useNavigate } from 'react-router-dom';

interface TaskCardProps {
  subTask: SubtaskIncludes;
}

const MyTaskCard = ({ subTask }: TaskCardProps) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    const { task, id } = subTask;
    // console.log(task.indexTask.workAreaId);:
    navigate(`/tareas/${task.indexTask.workAreaId}`, {
      state: {
        taskIdProp: task.id,
        subTaskIdProp: id,
      },
      replace: true,
    });
  };
  return (
    <div className="my-task-class">
      {/* <span className="task-text">{`${task.status == 'DONE'? "Hecho":"asd"}` }</span> */}

      <div className="my-task-content">
        <span className={`my-icon-card`}>
          <img
            src={
              subTask.status === 'DONE'
                ? icon_done
                : subTask.status === 'PROCESS'
                ? icon_list_task
                : ''
            }
            className="img-task"
          />
        </span>
        <span
          className={`task-text ${subTask.status === 'DENIED' && 'hold'} ${
            subTask.status === 'PROCESS' && 'process'
          } ${subTask.status === 'DONE' && 'done'}`}
        >
          {subTask.status === 'DENIED' && 'Por Revisar'}
          {subTask.status === 'PROCESS' && 'En Revisión'}
        </span>
        <div className="task-header">
          <h2>{subTask.name}</h2>
          <span>Precio: S/{subTask.price}</span>
        </div>
      </div>
      <div className="footer-my-task">
        <h3>
          Fecha Inicio: {`${subTask.createdAt && _date(subTask.createdAt)}`}
        </h3>
        <span onClick={handleNavigate}>Ver mas</span>
      </div>
    </div>
  );
};

export default MyTaskCard;
