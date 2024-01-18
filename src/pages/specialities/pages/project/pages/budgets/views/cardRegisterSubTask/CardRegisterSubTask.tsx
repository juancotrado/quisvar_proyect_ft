import { useContext, useEffect, useRef, useState } from 'react';
import {
  Button,
  CloseIcon,
  Input,
  Modal,
  TextArea,
} from '../../../../../../../../components';
import './cardRegisterSubTask.css';
import { SubmitHandler, useForm } from 'react-hook-form';
import { axiosInstance } from '../../../../../../../../services/axiosInstance';
import { SocketContext } from '../../../../../../../../context';
import { isOpenCardRegisteTask$ } from '../../../../../../../../services/sharingSubject';
import { Subscription } from 'rxjs';
import { useParams } from 'react-router-dom';
import {
  validateCorrectTyping,
  validateWhiteSpace,
  validateOnlyDecimals,
} from '../../../../../../../../utils';
import { SubTaskForm } from '../../models';

const CardRegisterSubTask = () => {
  const {
    handleSubmit,
    register,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<SubTaskForm>();

  const socket = useContext(SocketContext);
  const { stageId } = useParams();
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
          days: task.days,
          name: task.name,
        });
      } else {
        setLevelId(data.levelId);
      }
    });
    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, [reset, setValue]);

  const onSubmit: SubmitHandler<SubTaskForm> = data => {
    const body = { ...data, days: +data.days, stageId };
    if (data.id) {
      axiosInstance.patch(`/subtasks/${data.id}`, body).then(res => {
        socket.emit('client:update-project', res.data);
      });
    } else {
      axiosInstance
        .post('/subtasks', { ...body, levels_Id: levelId })
        .then(res => {
          socket.emit('client:update-project', res.data);
        });
    }
    closeFunctions();
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
          <h2>{watch('id') ? 'ACTUALIZAR TAREA' : 'REGISTRAR TAREA'}</h2>
          <CloseIcon onClick={closeFunctions} />
        </div>
        <div className="col-input">
          <Input
            label="Nombre"
            {...register('name', {
              validate: { validateCorrectTyping, validateWhiteSpace },
            })}
            name="name"
            type="text"
            errors={errors}
          />
          <Input
            label="Dias"
            type="number"
            {...register('days', {
              validate: { validateOnlyDecimals },
              value: 0,
            })}
            name="days"
            step={0.01}
            errors={errors}
          />
        </div>
        <div className="col-input">
          <TextArea
            label="Descripción"
            {...register('description')}
            name="description"
            placeholder="Opcional"
          />
        </div>

        <Button text="Guardar" className="btn-area send-button" type="submit" />
      </form>
    </Modal>
  );
};

export default CardRegisterSubTask;
