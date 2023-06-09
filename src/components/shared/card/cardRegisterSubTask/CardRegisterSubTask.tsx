import { useContext, useEffect, useMemo, useState } from 'react';
import { Input, TextArea } from '../../..';
import './cardRegisterSubTask.css';
import DropDownSimple from '../../select/DropDownSimple';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
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
type DataUser = { id: number; name: string };

const CardRegisterSubTask = ({
  subTask,
  taskId,
  typeTask,
}: CardRegisterSubTaskProps) => {
  const { listUsers } = useSelector((state: RootState) => state);
  const [usersData, setUsersData] = useState<DataUser[]>([]);
  const { handleSubmit, register, setValue, watch, reset } =
    useForm<SubTaskForm>();
  const socket = useContext(SocketContext);
  const users = useMemo(
    () =>
      listUsers
        ? listUsers.map(({ profile, ...props }) => ({
            name: `${profile.firstName} ${profile.lastName}`,
            ...props,
          }))
        : [],
    [listUsers]
  );
  console.log('subTask', subTask);
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
      if (usersData.length) {
        console.log({ ...data, usersData });
        return;
      }
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

  const handleAddUser = (user: DataUser) => {
    const getId = usersData.find(list => list.id == user.id);
    if (!getId) setUsersData([...usersData, user]);
  };

  const handleRemoveUser = (user: DataUser) => {
    const filterValue = usersData.filter(list => list.id !== user.id);
    setUsersData(filterValue);
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
      <hr></hr>
      <Input label="Nombre" {...register('name')} name="name" type="text" />
      <TextArea
        label="Descripción"
        {...register('description')}
        name="description"
      />
      {/* <div className="col-input col-files">
          <div className="manual-file">
            <div className="input-file">
              <InputFile
                getFiles={files => console.log(files)}
                label="Manuales"
              />
            </div>
            <div className="list-file"><div>awassss</div></div>
          </div>
          <div className="manual-file">
            <div className="input-file">
              <InputFile
                getFiles={files => console.log(files)}
                label="Manuales"
              />
            </div>
            <div className="list-file"><div>awassss</div></div>
          </div>
        </div> */}
      <div className="col-input">
        {false && (
          <div className="col-users">
            <DropDownSimple
              data={users}
              textField="name"
              itemKey="id"
              label="Usuarios"
              valueInput={(name, id) =>
                handleAddUser({ id: parseInt(id), name })
              }
            />
            {usersData &&
              usersData.map((_user, index) => (
                <div key={_user.id} className="col-list-user">
                  <span className="user-info">
                    {index + 1}
                    {') '}
                    {_user.name}
                  </span>
                  <button
                    type="button"
                    className="delete-list-user"
                    onClick={() => handleRemoveUser(_user)}
                  >
                    <img src="/svg/close.svg" />
                  </button>
                </div>
              ))}
          </div>
        )}
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
