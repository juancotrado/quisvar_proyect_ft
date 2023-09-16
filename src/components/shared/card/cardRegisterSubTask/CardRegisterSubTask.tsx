import { useContext, useEffect, useRef, useState } from 'react';
import { Input, TextArea } from '../../..';
import './cardRegisterSubTask.css';
import { SubmitHandler, useForm } from 'react-hook-form';
import { axiosInstance } from '../../../../services/axiosInstance';
import { SocketContext } from '../../../../context/SocketContex';
import { isOpenCardRegisteTask$ } from '../../../../services/sharingSubject';
import Button from '../../button/Button';
import Modal from '../../../portal/Modal';
import { Subscription } from 'rxjs';

type SubTaskForm = {
  id: number | null;
  name: string;
  description?: string;
  days: number;
  price: number | string;
};

interface CardRegisterSubTaskProps {
  onSave?: () => void;
}

const CardRegisterSubTask = ({ onSave }: CardRegisterSubTaskProps) => {
  const { handleSubmit, register, setValue, watch, reset } =
    useForm<SubTaskForm>();
  const socket = useContext(SocketContext);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [levelId, setLevelId] = useState<number | null>(null);
  const handleIsOpen = useRef<Subscription>(new Subscription());

  useEffect(() => {
    handleIsOpen.current = isOpenCardRegisteTask$.getSubject.subscribe(data => {
      setIsOpenModal(data.isOpen);
      const { task } = data;
      if (task) {
        reset({
          id: task.id,
          description: task.description,
          days: task.hours / 24,
          name: task.name,
          price: task.price,
        });
      } else {
        setLevelId(data.levelId);
      }
    });
    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, [setValue]);

  const onSubmit: SubmitHandler<SubTaskForm> = data => {
    const body = { ...data, days: +data.days };
    if (data.id) {
      axiosInstance.patch(`/subtasks/${data.id}`, body).then(res => {
        socket.emit('client:update-subTask', res.data);
        onSave?.();
      });
    } else {
      axiosInstance
        .post('/subtasks', { ...body, levels_Id: levelId })
        .then(res => {
          socket.emit('client:create-subTask', res.data);
          onSave?.();
        });
    }
    closeFunctions();
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
    setIsOpenModal(false);
    reset({});
  };

  return (
    <Modal size={50} isOpenProp={isOpenModal}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card-register-project"
        autoComplete="off"
      >
        <div className="subtask-head-title">
          <h2>{levelId ? 'ACTUALIZAR TAREA' : 'REGISTRAR TAREA'}</h2>
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
    </Modal>
  );
};

export default CardRegisterSubTask;
