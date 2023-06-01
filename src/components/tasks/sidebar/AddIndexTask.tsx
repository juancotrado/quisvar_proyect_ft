/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Input } from '../..';
import Button from '../../shared/button/Button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { axiosInstance } from '../../../services/axiosInstance';

type IndexTaskForm = { name: string; workAreaId: number };

interface AddIndexTaskProps {
  workAreaId: number;
  onSave?: () => void;
}
const AddIndexTask = ({ onSave, workAreaId }: AddIndexTaskProps) => {
  const [addIndexTask, setAddIndexTask] = useState<boolean>(false);
  const { handleSubmit, register, setValue } = useForm<IndexTaskForm>();

  useEffect(() => {
    setValue('workAreaId', workAreaId);
  }, [workAreaId]);

  const onSubmitIndexTask: SubmitHandler<IndexTaskForm> = async values => {
    await axiosInstance.post('/indextasks', values).then(() => {
      onSave?.();
      setAddIndexTask(false);
    });
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmitIndexTask)}
      className="aside-add-index-task"
    >
      {addIndexTask ? (
        <Input {...register('name')} name="name" className="input-task" />
      ) : (
        <span>AÑADIR ÍNDICE DE TAREA </span>
      )}
      {addIndexTask && <Button icon="save" className="add-btn-indextask" />}
      <Button
        type="button"
        icon={addIndexTask ? 'close' : 'plus'}
        className="add-btn-indextask"
        whileHover={{ rotate: 90 }}
        whileTap={{ scale: 1.1 }}
        onClick={() => setAddIndexTask(!addIndexTask)}
      />
    </form>
  );
};

export default AddIndexTask;
