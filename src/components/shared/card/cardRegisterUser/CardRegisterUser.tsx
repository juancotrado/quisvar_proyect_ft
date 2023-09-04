/* eslint-disable react-hooks/exhaustive-deps */
import './CardRegisterUser.css';
import { useEffect, useState } from 'react';
import Modal from '../../../portal/Modal';
import { axiosInstance } from '../../../../services/axiosInstance';
import { isOpenModal$ } from '../../../../services/sharingSubject';
import Button from '../../button/Button';
import { SubmitHandler, useForm } from 'react-hook-form';
import InputText from '../../Input/Input';
import { UserForm, User } from '../../../../types/types';
import { validateEmail } from '../../../../utils/customValidatesForm';
import { Input } from '../../..';
interface CardRegisterUserProps {
  onSave?: () => void;
  onClose?: () => void;
  user?: User | null;
}

const InitialValues: UserForm = {
  id: 0,
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  dni: '',
  phone: '',
  degree: '',
  description: '',
  job: '',
  cv: null,
};

const CardRegisterUser = ({ user, onSave, onClose }: CardRegisterUserProps) => {
  const [data, setData] = useState<UserForm>(InitialValues);
  const [errorPassword, setErrorPassword] = useState<{
    [key: string]: { [key: string]: string };
  }>();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<UserForm>({
    defaultValues: InitialValues,
  });

  useEffect(() => {
    if (user?.id) {
      const { profile, ..._data } = user;
      setData({ ...profile, ..._data, cv: null });
    } else {
      setData(InitialValues);
    }
  }, [user]);

  useEffect(() => {
    setValue('id', data.id);
    setValue('email', data.email);
    setValue('password', data.password);
    setValue('dni', data.dni);
    setValue('firstName', data.firstName);
    setValue('lastName', data.lastName);
    setValue('phone', data.phone);
    setValue('job', data.job);
    setValue('degree', data.degree);
    setValue('description', data.description);
  }, [data]);

  const onSubmit: SubmitHandler<UserForm> = async data => {
    const fileCv = data.cv?.[0] as File;
    const formData = new FormData();
    formData.append('fileUser', fileCv);
    formData.append('id', data.id + '');
    formData.append('degree', data.degree);
    formData.append('description', data.description);
    formData.append('dni', data.dni);
    formData.append('email', data.email);
    formData.append('firstName', data.firstName);
    formData.append('job', data.job);
    formData.append('lastName', data.lastName);
    formData.append('password', data.password);
    formData.append('phone', data.phone);

    if (data.id) {
      axiosInstance.put(`/profile/${data.id}`, data).then(successfulShipment);
    } else {
      const headers = {
        'Content-type': 'multipart/form-data',
      };
      axiosInstance
        .post(`/users?isContract=false`, formData, { headers })
        .then(successfulShipment);
    }
  };

  const successfulShipment = () => {
    onSave?.();
    isOpenModal$.setSubject = false;
  };

  const closeFunctions = () => {
    isOpenModal$.setSubject = false;
    onClose?.();
    setErrorPassword({});
    reset();
  };

  const verifyPasswords = ({ target }: React.FocusEvent<HTMLInputElement>) => {
    const error = {
      verifyPassword: { message: 'Las contraseñas no coinciden' },
    };
    watch('password') !== target.value
      ? setErrorPassword(error)
      : setErrorPassword({});
  };

  return (
    <Modal size={50}>
      <form onSubmit={handleSubmit(onSubmit)} className="card-register-users">
        <span className="close-icon" onClick={closeFunctions}>
          <img src="/svg/close.svg" alt="pencil" />
        </span>
        <h1>
          {user ? 'EDITAR DATOS DE USUARIO' : 'REGISTRO DE NUEVO USUARIO'}
        </h1>
        <div className="col-input">
          <InputText
            {...register('dni', { required: true, maxLength: 9 })}
            placeholder="N°"
            label="DNI"
            errors={errors}
            type="number"
          />
          <InputText
            {...register('firstName', { required: true })}
            placeholder="Nombres"
            label="Nombres"
            errors={errors}
          />
          <InputText
            {...register('lastName')}
            placeholder="Apellidos"
            errors={errors}
            label="Apellidos"
          />
        </div>
        <div className="col-input">
          {!user && (
            <InputText
              {...register('password', { required: true })}
              errors={errors}
              placeholder="Contraseña"
              type="password"
              autoComplete="no"
              label="Contraseña"
            />
          )}
          {!user && (
            <InputText
              errors={errorPassword}
              name="verifyPassword"
              onBlur={e => verifyPasswords(e)}
              placeholder="Confirmar contraseña"
              type="password"
              autoComplete="no"
              label="Confirmar contraseña"
            />
          )}
        </div>
        <div className="col-input">
          <InputText
            {...register('email', {
              required: true,
              validate: validateEmail,
            })}
            errors={errors}
            placeholder="Correo"
            label="Correo"
            name="email"
          />
          <InputText
            {...register('phone')}
            placeholder="Celular"
            label="Celular"
            type="number"
            errors={errors}
          />
        </div>
        <div className="col-input">
          <InputText
            {...register('job')}
            placeholder="Profesión"
            type="text"
            label="Profesión"
            errors={errors}
          />
          <InputText
            {...register('degree')}
            placeholder="Grado"
            type="text"
            errors={errors}
            label="Grado"
          />
          <InputText
            {...register('description')}
            placeholder="Cargo"
            type="text"
            errors={errors}
            label="Cargo"
          />
        </div>
        {!user?.id && (
          <div className="col-input">
            <Input
              type="file"
              label="CV"
              placeholder="cv"
              {...register('cv', { required: true })}
              errors={errors}
            />
          </div>
        )}
        <div className="btn-build">
          <Button
            text={user ? 'GUARDAR' : 'CREAR'}
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
