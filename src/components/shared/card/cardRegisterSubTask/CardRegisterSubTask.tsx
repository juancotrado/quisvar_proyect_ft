import { useMemo, useState } from 'react';
import { Input, TextArea } from '../../..';
import './cardRegisterSubTask.css';
import DropDownSimple from '../../select/DropDownSimple';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { SubmitHandler, useForm } from 'react-hook-form';
import InputFile from '../../Input/InputFile';

type SubTaskForm = {
  id: number;
  name: string;
  description?: string;
  hours: number;
  price: number;
};

interface CardRegisterSubTaskProps {
  subTask?: any;
  subTaskId?: number;
}

type DataUser = { id: number; name: string };

const CardRegisterSubTask = ({
  subTask,
  subTaskId,
}: CardRegisterSubTaskProps) => {
  const { listUsers } = useSelector((state: RootState) => state);
  const [usersData, setUsersData] = useState<DataUser[]>([]);
  const { handleSubmit, register, setValue, watch } = useForm<SubTaskForm>();
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

  const onSubmit: SubmitHandler<SubTaskForm> = values => {
    const users = usersData.map(u => ({ id: u.id }));
    console.log({ ...values, users, subTaskId });
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
        <div className="col-users">
          <DropDownSimple
            data={users}
            textField="name"
            itemKey="id"
            label="Usuarios"
            valueInput={(name, id) => handleAddUser({ id: parseInt(id), name })}
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
                  <img src="svg/close.svg" />
                </button>
              </div>
            ))}
        </div>
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
