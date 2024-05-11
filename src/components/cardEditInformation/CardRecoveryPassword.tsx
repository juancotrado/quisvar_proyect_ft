import { useForm } from 'react-hook-form';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';
import InputText from '../Input/Input';
import Button from '../button/Button';
import { axiosInstance } from '../../services/axiosInstance';
import { validateRepeatPassword } from '../../utils';

interface Recovery {
  oldpassword: string;
  newpassword: string;
  verifyPassword: string;
}

interface CardRecoveryPasswordProps {
  onClose?: () => void;
}

const CardRecoveryPassword = ({ onClose }: CardRecoveryPasswordProps) => {
  const userSession = useSelector((state: RootState) => state.userSession);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<Recovery>();

  const onSubmit = async (values: Recovery) => {
    if (userSession?.id !== undefined) {
      axiosInstance.post('/auth/recovery', values).then(({ data }) => {
        localStorage.setItem('token', data.token);
        onClose?.();
      });
    }
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
          {...(register('oldpassword'), { required: true })}
          errors={errors}
          name="oldpassword"
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
          errors={errors}
          {...register('verifyPassword', {
            required: true,
            validate: val => validateRepeatPassword(val, watch('newpassword')),
          })}
          name="verifyPassword"
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
