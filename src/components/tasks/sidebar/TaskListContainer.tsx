import { useState } from 'react';
import { Task } from '../../../types/types';
import Button from '../../shared/button/Button';
import { Input } from '../..';
import ButtonDelete from '../../shared/button/ButtonDelete';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { axiosInstance } from '../../../services/axiosInstance';

interface TaskListContainerProps {
  task: Task;
  onSave?: () => void;
  taskSelected: number | null;
}

const TaskListContainer = ({
  task,
  onSave,
  taskSelected,
}: TaskListContainerProps) => {
  const [openEditTask, setOpenEditTask] = useState<boolean>(false);
  const { userSession } = useSelector((state: RootState) => state);
  const [name, setName] = useState<string>();
  const role = userSession?.role ? userSession.role : 'EMPLOYEE';

  const toggleInput = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    setName(value);
  };

  const handleForm = async () => {
    await axiosInstance.patch(`tasks/${task.id}`, { name }).then(() => {
      setOpenEditTask(false);
      onSave?.();
    });
  };

  return (
    <div className="aside-dropdown-sub-list-item">
      {openEditTask ? (
        <Input
          defaultValue={task.name}
          type="text"
          className="input-task"
          onClick={e => e.stopPropagation()}
          onChange={e => toggleInput(e)}
        />
      ) : (
        <span
          className={`aside-dropdown-sub-list-span ${
            task.id === taskSelected && 'aside-dropdown-sub-list-span-active'
          }`}
        >
          {task.item}. {task.name.toLowerCase()}
        </span>
      )}
      {role !== 'EMPLOYEE' && (
        <div className="menu-index-task">
          <Button
            type="button"
            icon={openEditTask ? 'close' : 'pencil'}
            className="delete-task"
            onClick={e => {
              e.stopPropagation();
              setOpenEditTask(!openEditTask);
            }}
          />
          {openEditTask ? (
            <Button
              type="button"
              icon="save"
              className="delete-indextask"
              onClick={e => {
                e.stopPropagation();
                handleForm();
                // setOpenEditIndexTask(!openEditIndexTask);
              }}
            />
          ) : (
            <>
              {task._count?.subTasks === 0 && (
                <ButtonDelete
                  type="button"
                  icon="trash-red"
                  className="delete-task"
                  onSave={onSave}
                  url={`/tasks/${task.id}`}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskListContainer;
