import { useEffect, useState } from 'react';
import Button from '../../../shared/button/Button';
import { Input } from '../../..';
import { SubmitHandler, useForm } from 'react-hook-form';
import { axiosInstance } from '../../../../services/axiosInstance';

type TaskForm = { name: string; idValue: number; unique: boolean };

interface AddTaskProps {
  idValue: number;
  keyNameId: 'workAreaId' | 'indexTaskId' | 'taskId' | 'task_2_Id';
  onSave?: () => void;
}

const urlPost = {
  workAreaId: '/indextasks',
  indexTaskId: '/tasks',
  taskId: '/tasks2',
  task_2_Id: '/tasks3',
};

const SidebarAddNewLevel = ({ idValue, onSave, keyNameId }: AddTaskProps) => {
  const [addLevel, setAddLevel] = useState<boolean>(false);
  const { handleSubmit, register, reset, setValue } = useForm<TaskForm>();
  const isLastLevel = keyNameId === 'task_2_Id';

  useEffect(() => {
    reset({
      [keyNameId]: idValue,
    });
    if (isLastLevel) {
      setValue('unique', true);
    }
  }, [idValue]);

  const onSubmitTask: SubmitHandler<TaskForm> = async values => {
    const url = urlPost[keyNameId as keyof typeof urlPost];
    await axiosInstance.post(url, values).then(() => {
      onSave?.();
      setAddLevel(false);
      reset();
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitTask)}
      className="aside-add-index-task"
    >
      {addLevel ? (
        <Input {...register('name')} name="name" className="input-task" />
      ) : (
        <span>AÑADIR NIVEL </span>
      )}
      {addLevel && (
        <>
          {!isLastLevel && (
            <input {...register('unique')} type="checkbox" name="unique" />
          )}

          <Button icon="save" className="add-btn-indextask" />
        </>
      )}
      <Button
        type="button"
        icon={addLevel ? 'close' : 'plus'}
        className="add-btn-indextask"
        whileHover={{ rotate: 90 }}
        whileTap={{ scale: 1.1 }}
        onClick={() => setAddLevel(!addLevel)}
      />
    </form>
  );
};

export default SidebarAddNewLevel;
