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
import { SocketContext } from '../../../../../../../../context';
import {
  isOpenCardRegisteTask$,
  loader$,
} from '../../../../../../../../services/sharingSubject';
import { Subscription } from 'rxjs';
import { useParams } from 'react-router-dom';
import {
  validateCorrectTyping,
  validateWhiteSpace,
  validateOnlyDecimals,
} from '../../../../../../../../utils';
import { SubTaskForm } from '../../models';
import { OPTION_PROJECT } from '../../../../models';

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
      const { task, type, option } = data;
      if (task) {
        reset({
          id: task.id,
          description: task.description,
          days: task.days,
          name: task.name,
          option,
        });
        if (type) reset({ ...watch(), type, option });
      } else {
        setLevelId(data.levelId);
        reset({ ...watch(), option });
      }
    });
    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, [reset, setValue]);

  const onSubmit: SubmitHandler<SubTaskForm> = data => {
    const { type, option, ...resData } = data;
    const body = { ...resData, stageId };
    loader$.setSubject = true;
    if (body.id) {
      if (type) {
        // axiosInstance
        //   .post(`${typeTask}/${id}/${stageId}?type=${type}`, resData)
        //   .then(res => {
        //     socket.emit('client:update-project', res.data, type);
        //   });
        socket.emit(
          OPTION_PROJECT[option].addUppeOrLowerTask,
          body,
          type,
          () => {
            loader$.setSubject = false;
          }
        );
      } else {
        socket.emit(OPTION_PROJECT[option].editTask, body, () => {
          loader$.setSubject = false;
        });
      }
    } else {
      socket.emit(
        OPTION_PROJECT[option].addTask,
        { ...body, levels_Id: levelId },
        () => {
          loader$.setSubject = false;
        }
      );

      // axiosInstance
      //   .post(`/${typeTask}`, { ...body, levels_Id: levelId })
      //   .then(res => {
      //     socket.emit('client:update-project', res.data);
      //   });
    }
    closeFunctions();
  };

  const closeFunctions = () => {
    setIsOpenModal(false);
    reset({ id: null });
  };

  return (
    <Modal size={50} isOpenProp={isOpenModal}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card-register"
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
              valueAsNumber: true,
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

        <Button text="Guardar" type="submit" styleButton={4} />
      </form>
    </Modal>
  );
};

export default CardRegisterSubTask;
