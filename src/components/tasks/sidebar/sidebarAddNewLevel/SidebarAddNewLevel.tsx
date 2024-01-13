import { useEffect, useState } from 'react';
import Button from '../../../button/Button';
import { Input } from '../../..';
import { SubmitHandler, useForm } from 'react-hook-form';
import { axiosInstance } from '../../../../services/axiosInstance';
import DotsOption from '../../../dots/DotsOption';
import { Option } from '../../../../types/types';
import './sidebarAddNewLevel.css';
import {
  validateWhiteSpace,
  validateCorrectTyping,
} from '../../../../utils/customValidatesForm';

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
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<TaskForm>();
  const isLastLevel = keyNameId === 'task_2_Id';

  useEffect(() => {
    reset({
      [keyNameId]: idValue,
      unique: isLastLevel,
    });
  }, [idValue, isLastLevel, keyNameId, reset]);

  const onSubmitTask: SubmitHandler<TaskForm> = async values => {
    const url = urlPost[keyNameId];
    await axiosInstance.post(url, values).then(() => {
      onSave?.();
      setAddLevel(false);
      reset();
    });
  };

  const handleAddlevel = () => setAddLevel(!addLevel);
  const optionsData: Option[] = [
    {
      name: 'Cancelar',
      type: 'button',
      icon: 'close',
      function: () => setAddLevel(!addLevel),
    },
    {
      name: 'Guardar',
      type: 'submit',
      icon: 'save',
    },
  ];

  return (
    <form
      onSubmit={handleSubmit(onSubmitTask)}
      className="aside-add-index-task"
    >
      {addLevel ? (
        <>
          <Input
            {...register('name', {
              required: 'Este campo es obligatorio',
              validate: { validateWhiteSpace, validateCorrectTyping },
            })}
            name="name"
            errors={errors}
            className="input-task"
          />
          <div className="aside-unique-container">
            <label htmlFor="unique">Unico:</label>
            <input {...register('unique')} type="checkbox" name="unique" />
          </div>
        </>
      ) : (
        <span>AÑADIR NIVEL</span>
      )}
      {!addLevel ? (
        <Button
          type="button"
          icon={'plus'}
          className="add-btn-indextask"
          whileHover={{ rotate: 90 }}
          whileTap={{ scale: 1.1 }}
          onClick={handleAddlevel}
        />
      ) : (
        <DotsOption
          notPositionRelative
          data={optionsData}
          className="sidebarAddNewLevel-menu-dots-option"
        />
      )}
    </form>
  );
};

export default SidebarAddNewLevel;
