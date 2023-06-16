/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import Button from '../../shared/button/Button';
import { Input } from '../..';
import { SubmitHandler, useForm } from 'react-hook-form';
import { axiosInstance } from '../../../services/axiosInstance';

type TaskForm = { name: string; indexTaskId: number };

interface AddTaskProps {
  indexTaskId: number;
  onSave?: () => void;
}

const AddTask = ({ indexTaskId, onSave }: AddTaskProps) => {
  const [addTask, setAddTask] = useState<boolean>(false);
  const { handleSubmit, register, setValue } = useForm<TaskForm>();

  useEffect(() => {
    setValue('indexTaskId', indexTaskId);
  }, [indexTaskId]);

  const onSubmitTask: SubmitHandler<TaskForm> = async values => {
    await axiosInstance.post('/tasks', values).then(() => {
      onSave?.();
      setAddTask(false);
    });
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmitTask)}
      className="aside-add-index-task"
    >
      {addTask ? (
        <Input {...register('name')} name="name" className="input-task" />
      ) : (
        <span>AÑADIR TAREA </span>
      )}
      {addTask && (
        <>
          {/* <Button icon="save" className="add-btn-indextask" /> */}
          <Button icon="save" className="add-btn-indextask" />
        </>
      )}
      <Button
        type="button"
        icon={addTask ? 'close' : 'plus'}
        className="add-btn-indextask"
        whileHover={{ rotate: 90 }}
        whileTap={{ scale: 1.1 }}
        onClick={() => setAddTask(!addTask)}
      />
    </form>
  );
};

export default AddTask;
