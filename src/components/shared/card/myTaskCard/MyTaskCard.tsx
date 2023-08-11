import './mytaskcard.css';
import { SubtaskIncludes, TypeTask } from '../../../../types/types';
import { _date } from '../../../../utils/formatDate';
import { useNavigate } from 'react-router-dom';

interface TaskCardProps {
  subTask: SubtaskIncludes;
}

const MyTaskCard = ({ subTask }: TaskCardProps) => {
  const navigate = useNavigate();
  const navigateLocation = (
    workAreaId: number,
    taskIdProp: number,
    subTaskIdProp: number,
    subTaskType: TypeTask
  ) => {
    return navigate(`/tareas/${workAreaId}`, {
      state: {
        taskIdProp,
        subTaskIdProp,
        subTaskType,
      },
      replace: true,
    });
  };

  const handleNavigate = () => {
    const { indexTask, task, task_lvl_2, task_lvl_3, id } = subTask;
    if (indexTask) {
      navigateLocation(indexTask.workAreaId, indexTask.id, id, 'indextask');
    }
    if (task) {
      navigateLocation(task.indexTask.workAreaId, task.id, id, 'task');
    }
    if (task_lvl_2) {
      navigateLocation(
        task_lvl_2.task.indexTask.workAreaId,
        task_lvl_2.id,
        id,
        'task2'
      );
    }
    if (task_lvl_3) {
      navigateLocation(
        task_lvl_3.task_2.task.indexTask.workAreaId,
        task_lvl_3.id,
        id,
        'task3'
      );
    }
  };

  return (
    <div className={`my-task-class`}>
      {/* <span className="task-text">{`${task.status == 'DONE'? "Hecho":"asd"}` }</span> */}

      <div className="my-task-content">
        <span
          className={`my-icon-card ${
            subTask.status === 'DONE'
              ? 'my-icon-card-done'
              : subTask.status === 'PROCESS'
              ? 'my-icon-card-process'
              : 'my-icon-card-denied'
          }`}
        >
          <img
            src={
              subTask.status === 'DONE'
                ? 'svg/task_done.svg'
                : subTask.status === 'PROCESS'
                ? 'svg/icon_list_task.svg'
                : 'svg/task_unresolved.svg'
            }
          />
        </span>
        <span>
          {subTask.item} {subTask.name}
        </span>
        <span>S/.{subTask.price}</span>
        <h3>Fecha: {`${subTask.createdAt && _date(subTask.createdAt)}`}</h3>
        <span
          className={`task-text ${
            subTask.status === 'DONE'
              ? 'my-icon-card-done-color'
              : subTask.status === 'PROCESS'
              ? 'my-icon-card-process-color'
              : 'my-icon-card-denied-color'
          }`}
        >
          {subTask.status === 'DENIED' && 'CORREGIR'}
          {subTask.status === 'PROCESS' && 'EN PROCESO'}
          {subTask.status === 'INREVIEW' && 'POR REVISAR'}
          {subTask.status === 'DONE' && 'HECHO'}
        </span>
        <span onClick={handleNavigate}>
          <b>Ver más</b>
        </span>
      </div>
    </div>
  );
};

export default MyTaskCard;
