import icon_unresolved from '/svg/task_unresolved.svg';
import icon_process from '/svg/task_process.svg';
import icon_done from '/svg/task_done.svg';
import './taskcard.css';
import { TaskType } from '../../../types/types';
import ButtonDelete from '../button/ButtonDelete';
import Button from '../button/Button';
import { isOpenModal$ } from '../../../services/sharingSubject';

interface TaskCardProps {
  task: TaskType;
  editTaskStatus: (id: number, status: string) => void;
  handleGetTaskData: (value: TaskType) => void;
  deleteTask: (id: number) => void;
}

const TaskCard = ({
  task,
  editTaskStatus,
  handleGetTaskData,
  deleteTask,
}: TaskCardProps) => {
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
    editTaskStatus(task.id, body.status);
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
    editTaskStatus(task.id, body.status);
  };

  const openModal = () => {
    handleGetTaskData(task);
    isOpenModal$.setSubject = true;
  };

  const sendIdForDelete = () => {
    deleteTask(task.id);
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
      <div className="task-content">
        <h2>{task.name} </h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam
          cupiditate, ex quam rerum in aspernatur commodi impedit enim illum
          corrupti, distinctio sed eveniet excepturi assumenda unde? Sed enim
          consequuntur adipisci?
        </p>
        <div className="buttons">
          {task.status == 'PROCESS' && (
            <button onClick={handlePrevius}>Previus</button>
          )}
          {(task.status === 'UNRESOLVED' || task.status == 'PROCESS') && (
            <button onClick={handleNext}>Next</button>
          )}
        </div>
        <div className="task-buttons-action">
          <ButtonDelete
            icon="trash"
            url={`/projects`}
            customOnClick={sendIdForDelete}
            className="project-delete-icon"
          />
          <Button
            icon="pencil"
            className="project-edit-icon"
            onClick={openModal}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
