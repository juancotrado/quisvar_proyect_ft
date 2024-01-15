/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';
import InputText from '../Input/Input';
import Button from '../button/Button';
import { axiosInstance } from '../../services/axiosInstance';

interface Recovery {
  oldpassword: string;
  newpassword: string;
}

interface CardRecoveryPasswordProps {
  onClose?: () => void;
}

const CardRecoveryPassword = ({ onClose }: CardRecoveryPasswordProps) => {
  const { userSession } = useSelector((state: RootState) => state);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<Recovery>();
  const [errorPassword, setErrorPassword] = useState<{ [key: string]: any }>();

  const onSubmit = async (values: Recovery) => {
    if (userSession?.id !== undefined) {
      axiosInstance.post('/auth/recovery', values).then(({ data }) => {
        localStorage.setItem('token', data.token);
        onClose?.();
      });
    }
  };

  const verifyPasswords = ({ target }: React.FocusEvent<HTMLInputElement>) => {
    const error = {
      verifyPassword: { message: 'Las contraseñas no coinciden' },
    };
    console.log(target.value);
    watch('newpassword') !== target.value
      ? setErrorPassword(error)
      : setErrorPassword({});
  };

  const handleClose = () => {
    reset();
    onClose?.();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="col-input">
        <h1>Restablecer Contraseña</h1>
      </div>
      <div className="divider"></div>
      <section className="inputs-section">
        <InputText
          {...register('oldpassword')}
          errors={errors}
          name="oldpassword"
          onBlur={e => verifyPasswords(e)}
          placeholder="Contraseña actual"
          type="password"
          autoComplete="no"
          label="Ingrese contraseña actual"
        />
        <InputText
          {...register('newpassword', { required: true })}
          name="newpassword"
          errors={errors}
          placeholder="Contraseña nueva"
          type="password"
          autoComplete="no"
          label="Contraseña Nueva"
        />
        <InputText
          errors={errorPassword}
          name="verifyPassword"
          onBlur={verifyPasswords}
          placeholder="Confirmar contraseña nueva"
          type="password"
          autoComplete="no"
          label="Confirmar contraseña nueva"
        />
      </section>
      <div className="divider"></div>

      <div className="col-btns">
        <Button
          text="CANCELAR"
          onClick={handleClose}
          className="bg-btn-close"
          type="button"
        />
        <Button text="GUARDAR" className="bg-inverse" type="submit" />
      </div>
    </form>
  );
};

export default CardRecoveryPassword;
