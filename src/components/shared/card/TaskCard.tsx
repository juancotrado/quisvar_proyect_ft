import icon_unresolved from '/svg/task_unresolved.svg';
import icon_process from '/svg/task_process.svg';
import icon_done from '/svg/task_done.svg';
import './taskcard.css';
import { Employees, TaskType } from '../../../types/types';
import ButtonDelete from '../button/ButtonDelete';
import Button from '../button/Button';
import { isOpenModal$ } from '../../../services/sharingSubject';
import useRole from '../../../hooks/useRole';

interface TaskCardProps {
  task: TaskType;
  editTaskStatus: (
    id: number,
    status: string,
    employees?: Employees[] | []
  ) => void;
  handleGetTaskData: (value: TaskType) => void;
  deleteTask: (id: number) => void;
}

const TaskCard = ({
  task,
  editTaskStatus,
  handleGetTaskData,
  deleteTask,
}: TaskCardProps) => {
  const { role, id, name } = useRole();

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
    const employees = [
      {
        user: {
          profile: {
            firstName: name,
            userId: id,
          },
        },
      },
    ];
    editTaskStatus(task.id, body.status, employees);
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

  console.log(task);
  return (
    <div className="task-class">
      <div className="task-header-card">
        {task.employees?.length === 0
          ? 'Libre'
          : task.employees?.at(0)?.user.profile.firstName}
      </div>
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

        <ol>
          {task.subtasks?.map(subtask => (
            <li key={subtask.id}>{subtask.name} </li>
          ))}
        </ol>
        {(id == task.employees?.at(0)?.user.profile.userId ||
          task.employees?.length === 0) && (
          <div className="buttons">
            {task.status == 'PROCESS' && (
              <button onClick={handlePrevius}>Previus</button>
            )}
            {(task.status === 'UNRESOLVED' || task.status == 'PROCESS') && (
              <button onClick={handleNext}>Asignarse </button>
            )}
          </div>
        )}
        {role !== 'EMPLOYEE' && (
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
        )}
      </div>
    </div>
  );
};

export default TaskCard;
