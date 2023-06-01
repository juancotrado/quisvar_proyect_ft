import { useContext, useEffect, useMemo, useState } from 'react';
import { Input, TextArea } from '../../..';
import './cardRegisterSubTask.css';
import DropDownSimple from '../../select/DropDownSimple';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { SubmitHandler, useForm } from 'react-hook-form';
import InputFile from '../../Input/InputFile';
import { axiosInstance } from '../../../../services/axiosInstance';
import { SocketContext } from '../../../../context/SocketContex';
import { isOpenModal$ } from '../../../../services/sharingSubject';
import { SubTask } from '../../../../types/types';

type SubTaskForm = {
  name: string;
  description?: string;
  hours: number;
  price: number;
};

interface CardRegisterSubTaskProps {
  subTask: SubTask | null;
  taskId: number;
}

type DataUser = { id: number; name: string };

const CardRegisterSubTask = ({ subTask, taskId }: CardRegisterSubTaskProps) => {
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

  useEffect(() => {
    if (!subTask) return;
    reset({
      description: subTask.description,
      hours: subTask.hours,
      name: subTask.name,
      price: +subTask.price,
    });
  }, [subTask]);

  const onSubmit: SubmitHandler<SubTaskForm> = data => {
    if (subTask?.id) {
      if (usersData.length) {
        console.log({ ...data, usersData });
        return;
      }
      axiosInstance.patch(`/subtasks/${subTask.id}`, data).then(res => {
        socket.emit('client:update-subTask', res.data);
      });
    } else {
      const body = { ...data, taskId };

      axiosInstance.post('/subtasks', body).then(res => {
        socket.emit('client:create-subTask', res.data);
        isOpenModal$.setSubject = false;
      });
    }
    // const users = usersData.map(u => ({ id: u.id }));
    // console.log({ ...values, users, taskId });
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
    const pricePerDay = 68.45;
    const price = (hours * pricePerDay) / 24;
    const roundPrice = Math.round(price * 100) / 100;
    setValue('price', roundPrice);
    return roundPrice;
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="card-register-project"
      autoComplete="off"
    >
      {/* <span className="close-add-card">
          <img src="/svg/close.svg" alt="pencil" />
        </span> */}
      <h2>{subTask ? 'ACTUALIZAR TAREA' : 'REGISTRAR TAREA'}</h2>
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
        <div className="col-hours ">
          <Input
            label="Horas"
            col={true}
            {...register('hours', { valueAsNumber: true })}
            type="number"
            name="hours"
          />
          <Input
            label="Precio S/."
            col={true}
            {...register('price', { valueAsNumber: true })}
            step={0.01}
            type="number"
            name="price"
            disabled={true}
            value={handleSetPrice(watch('hours'))}
            readOnly={true}
          />
        </div>
      </div>

      <button type="submit">send</button>
    </form>
  );
};

export default CardRegisterSubTask;
