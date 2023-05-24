import Input from '../../Input/Input';
import './CardRegisterUser.css';
import Select from '../../select/Select';
import { useEffect, useState } from 'react';
import Modal from '../../../portal/Modal';
import { axiosInstance } from '../../../../services/axiosInstance';
import { isOpenModal$ } from '../../../../services/sharingSubject';
import Button from '../../button/Button';
import { useForm, Controller } from 'react-hook-form';
interface CardRegisterUserProps {
  onSave?: () => void;
  dataRegisterUser?: User | null;
}

enum UserRole {
  'ADMIN',
  'EMPLOYEE',
  'MOD',
}
type User = {
  id: number;
  email: string;
  password: string;
  profile: Profile;
  role?: UserRole;
  status?: string;
};
type Profile = {
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
};
const InitialValues = {
  id: 0,
  email: '',
  password: '',
  profile: {
    firstName: '',
    lastName: '',
    dni: '',
    phone: '',
  },
};

const roles = [{ role: 'ADMIN' }, { role: 'EMPLOYEE' }, { role: 'MOD' }];
const status = [{ status: 'Activo' }, { status: 'Inactivo' }];

const CardRegisterUser = ({
  dataRegisterUser,
  onSave,
}: CardRegisterUserProps) => {
  const [data, setData] = useState<User>(InitialValues);
  // const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (dataRegisterUser) {
      setData(dataRegisterUser);
    }
  }, [dataRegisterUser]);

  const { handleSubmit, control } = useForm<User>();

  const onSubmit = async (values: User) => {
    console.log(values);
    let passData = {
      email: values.email,
      password: values.password,
      firstName: values.profile.firstName,
      lastName: values.profile.lastName,
      dni: values.profile.dni,
      phone: values.profile.phone,
    };
    console.log(passData);
    if (dataRegisterUser) {
      axiosInstance
        .patch(`/users/${data.id}`, passData)
        .then(successfulShipment);
    } else {
      axiosInstance.post(`/users`, passData).then(successfulShipment);
    }
  };

  const successfulShipment = () => {
    onSave?.();
    setData(InitialValues);
    window.location.reload();
  };
  // const handleChange = ({
  //   target,
  // }: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  //   const { name, value } = target;
  //   if (debounceRef.current) clearTimeout(debounceRef.current);
  //   debounceRef.current = setTimeout(() => {
  //     setData({
  //       ...data,
  //       [name]: value,
  //     });
  //   }, 250);
  // };

  const closeFunctions = () => {
    isOpenModal$.setSubject = false;
    setData(InitialValues);
  };
  return (
    <Modal size={50}>
      <form onSubmit={handleSubmit(onSubmit)} className="card-register-users">
        <span className="close-icon" onClick={closeFunctions}>
          <img src="/svg/close.svg" alt="pencil" />
        </span>
        <h1>
          {dataRegisterUser
            ? 'EDITAR DATOS DE USUARIO'
            : 'REGISTRO DE NUEVO USUARIO'}
        </h1>
        <Controller
          name="email"
          control={control}
          render={({ field }) => {
            return (
              <Input
                {...field}
                placeholder="Correo"
                defaultValue={data.email}
                label="Correo"
                disabled={dataRegisterUser ? true : false}
              />
            );
          }}
        />
        {!dataRegisterUser ? (
          <Controller
            name="password"
            control={control}
            render={({ field }) => {
              return (
                <Input
                  {...field}
                  placeholder="Contraseña"
                  type="password"
                  label="Contraseña"
                  defaultValue={data.password}
                />
              );
            }}
          />
        ) : (
          ''
        )}
        <div className="col-input">
          <Controller
            name="profile.firstName"
            control={control}
            render={({ field }) => {
              return (
                <Input
                  {...field}
                  placeholder="Nombres"
                  label="Nombres"
                  defaultValue={data.profile.firstName}
                  disabled={dataRegisterUser ? true : false}
                />
              );
            }}
          />
          <Controller
            name="profile.lastName"
            control={control}
            render={({ field }) => {
              return (
                <Input
                  {...field}
                  placeholder="Apellidos"
                  label="Apellidos"
                  defaultValue={data.profile.lastName}
                  disabled={dataRegisterUser ? true : false}
                />
              );
            }}
          />
        </div>
        <div className="col-input">
          <Controller
            name="profile.dni"
            control={control}
            render={({ field }) => {
              return (
                <Input
                  {...field}
                  placeholder="N°"
                  label="DNI"
                  defaultValue={data.profile.dni}
                  disabled={dataRegisterUser ? true : false}
                />
              );
            }}
          />
          <Controller
            name="profile.phone"
            control={control}
            render={({ field }) => {
              return (
                <Input
                  {...field}
                  placeholder="Celular"
                  label="Celular"
                  defaultValue={data.profile.phone}
                  disabled={dataRegisterUser ? true : false}
                />
              );
            }}
          />
        </div>
        {dataRegisterUser ? (
          <div className="col-input">
            <Controller
              name="role"
              control={control}
              render={({ field }) => {
                return (
                  <Select
                    {...field}
                    label="Rol"
                    defaultValue={data.role}
                    data={roles}
                    name="role"
                    itemKey="role"
                    textField="role"
                  />
                );
              }}
            />
            <Controller
              name="status"
              control={control}
              render={({ field }) => {
                return (
                  <Select
                    {...field}
                    label="Status"
                    defaultValue={data.status ? 'Activo' : 'Inactivo'}
                    data={status}
                    name="status"
                    itemKey="status"
                    textField="status"
                  />
                );
              }}
            />
          </div>
        ) : (
          ''
        )}
        <div className="btn-build">
          <Button
            text={dataRegisterUser ? 'CREAR' : 'GUARDAR'}
            className="btn-area"
            whileTap={{ scale: 0.9 }}
            type="submit"
          />
        </div>
      </form>
    </Modal>
  );
};

export default CardRegisterUser;
