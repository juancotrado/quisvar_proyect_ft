/* eslint-disable react-hooks/exhaustive-deps */
import './CardRegisterUser.css';
import { useEffect, useRef, useState } from 'react';
import Modal from '../../../portal/Modal';
import { axiosInstance } from '../../../../services/axiosInstance';
import { isOpenCardRegisterUser$ } from '../../../../services/sharingSubject';
import Button from '../../button/Button';
import { SubmitHandler, useForm } from 'react-hook-form';
import InputText from '../../Input/Input';
import { UserForm, User, WorkStation } from '../../../../types/types';
import { validateEmail } from '../../../../utils/customValidatesForm';
import { Input } from '../../..';
import { Subscription } from 'rxjs';
interface CardRegisterUserProps {
  onSave?: () => void;
  onClose?: () => void;
  user?: User | null;
  workStations?: WorkStation[];
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
  address: '',
  ruc: '',
  description: '',
  job: '',
  cv: null,
  declaration: null,
};

const CardRegisterUser = ({
  user,
  onSave,
  onClose,
  workStations,
}: CardRegisterUserProps) => {
  const [data, setData] = useState<UserForm>(InitialValues);
  const [isOpen, setIsOpen] = useState(false);
  const [stationId, setStationId] = useState<number>();
  const handleIsOpen = useRef<Subscription>(new Subscription());

  useEffect(() => {
    handleIsOpen.current = isOpenCardRegisterUser$.getSubject.subscribe(value =>
      setIsOpen(value)
    );
    return () => {
      handleIsOpen.current.unsubscribe();
    };
  }, []);

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
      setData({ ...profile, ..._data, cv: null, declaration: null });
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
    setValue('address', data.address);
    setValue('ruc', data.ruc);
  }, [data]);

  const onSubmit: SubmitHandler<UserForm> = async data => {
    const fileCv = data.cv?.[0] as File;
    const fileDeclaration = data.declaration?.[0] as File;
    const formData = new FormData();
    const workStationId = stationId;
    formData.append('fileUser', fileCv);
    formData.append('fileUser', fileDeclaration);
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
    formData.append('address', data.address);
    formData.append('ruc', data.ruc);
    if (data.id) {
      axiosInstance.put(`/profile/${data.id}`, data).then(successfulShipment);
    } else {
      const headers = {
        'Content-type': 'multipart/form-data',
      };
      axiosInstance
        .post(`/users?typeFile=cv`, formData, { headers })
        .then(successfulShipment);
    }
  };

  const successfulShipment = () => {
    onSave?.();
    setIsOpen(false);
    reset();
  };

  const closeFunctions = () => {
    setIsOpen(false);
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
    <Modal size={50} isOpenProp={isOpen}>
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
            {...register('address')}
            placeholder="Dirección"
            label="Dirección"
            errors={errors}
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
          <InputText
            {...register('ruc')}
            placeholder="ruc"
            type="text"
            errors={errors}
            label="ruc"
          />
        </div>
        <div className="col-station-area">
          <label className="input-label">Asignar equipo</label>
          <div className="user-station-list">
            {workStations &&
              workStations.map(workStation => {
                const [name, number] = workStation.name.split(' ');
                const slot = workStation.total - workStation.equipment.length;
                return (
                  <div className="user-station-pc" key={workStation.id}>
                    <h3>{name[0] + '-' + number}</h3>
                    <span
                      className="user-station"
                      onClick={() =>
                        setStationId(slot > 0 ? workStation.id : undefined)
                      }
                    >
                      <img src="/svg/pc-icon.svg" className="ule-icon-size" />
                      {slot}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
        {!user?.id && (
          <>
            <div className="col-input">
              <Input
                type="file"
                label="CV"
                placeholder="cv"
                {...register('cv', { required: !!user?.id })}
                errors={errors}
              />
              <Input
                type="file"
                label="Declaracion Jurada"
                placeholder="declaration"
                {...register('declaration', { required: !!user?.id })}
                errors={errors}
              />
            </div>
          </>
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
