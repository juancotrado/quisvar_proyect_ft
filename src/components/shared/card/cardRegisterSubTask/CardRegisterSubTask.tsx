import { useContext, useEffect } from 'react';
import { Input, TextArea } from '../../..';
import './cardRegisterSubTask.css';
import { SubmitHandler, useForm } from 'react-hook-form';
import { axiosInstance } from '../../../../services/axiosInstance';
import { SocketContext } from '../../../../context/SocketContex';
import { isOpenModal$ } from '../../../../services/sharingSubject';
import { SubTask, TypeTask } from '../../../../types/types';
import Button from '../../button/Button';

type SubTaskForm = {
  name: string;
  description?: string;
  days: number;
  price: number | string;
};

interface CardRegisterSubTaskProps {
  subTask: SubTask | null;
  taskId: number | null;
  typeTask?: TypeTask;
}

const CardRegisterSubTask = ({
  subTask,
  taskId,
  typeTask,
}: CardRegisterSubTaskProps) => {
  const { handleSubmit, register, setValue, watch, reset } =
    useForm<SubTaskForm>();
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (!subTask) return;
    reset({
      description: subTask.description,
      days: subTask.hours / 24,
      name: subTask.name,
      price: subTask.price,
    });
  }, [reset, subTask]);

  const onSubmit: SubmitHandler<SubTaskForm> = data => {
    const body = { ...data, hours: data.days * 24 };
    if (subTask?.id) {
      axiosInstance.patch(`/subtasks/${subTask.id}`, body).then(res => {
        socket.emit('client:update-subTask', res.data);
      });
    } else {
      let bodyForCreate;
      if (typeTask == 'indextask')
        bodyForCreate = { ...body, indexTaskId: taskId };
      if (typeTask == 'task') bodyForCreate = { ...body, taskId };
      if (typeTask == 'task2') bodyForCreate = { ...body, task_2_Id: taskId };
      if (typeTask == 'task3') bodyForCreate = { ...body, task_3_Id: taskId };
      axiosInstance.post('/subtasks', bodyForCreate).then(res => {
        socket.emit('client:create-subTask', res.data);
      });
    }
    isOpenModal$.setSubject = false;
  };

  const handleSetPrice = (hours: number) => {
    if (!hours) return 0;
    const pricePerDay = 86.67;
    const price = hours * pricePerDay;
    const roundPrice = price.toFixed(2);
    setValue('price', roundPrice);
    return roundPrice;
  };

  const closeFunctions = () => {
    isOpenModal$.setSubject = false;
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="card-register-project"
      autoComplete="off"
    >
      <div className="subtask-head-title">
        <h2>{subTask ? 'ACTUALIZAR TAREA' : 'REGISTRAR TAREA'}</h2>
        <Button
          type="button"
          icon="close"
          className="close-add-card-subtask"
          onClick={closeFunctions}
        />
      </div>
      <Input label="Nombre" {...register('name')} name="name" type="text" />
      <TextArea
        label="Descripción"
        {...register('description')}
        name="description"
      />

      <div className="col-input">
        <div className="col-hours-subtask">
          <Input
            label="Dias"
            col={true}
            {...register('days')}
            type="number"
            name="days"
            step={0.01}
          />
          <Input
            label="Precio S/."
            col={true}
            {...register('price', { valueAsNumber: true })}
            step={0.01}
            name="price"
            disabled={true}
            value={handleSetPrice(watch('days'))}
            readOnly={true}
          />
        </div>
      </div>
      <Button text="Guardar" className="btn-area" type="submit" />
    </form>
  );
};

export default CardRegisterSubTask;
