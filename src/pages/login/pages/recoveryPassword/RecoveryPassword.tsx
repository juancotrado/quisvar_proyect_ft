import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosInstance } from '../../../../services/axiosInstance';
import { Input } from '../../../../components';
import { SnackbarUtilities, validateDNI } from '../../../../utils';
import { useValidatePassword } from '../../../../hooks';
interface resetPassworForm {
  newPassword: string;
}

const RecoveryPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<resetPassworForm>();
  const { errorPassword, verifyPasswords } = useValidatePassword(
    watch('newPassword')
  );
  const sendForm: SubmitHandler<resetPassworForm> = data => {
    if (errorPassword?.verifyPassword) return;
    console.log(data, errorPassword);
    axiosInstance
      .post('/auth/new-password', data, {
        headers: {
          resetToken: token,
        },
      })
      .then(() => {
        navigate('/login');
        SnackbarUtilities.success('contraseña cambiada exitosamente');
      })
      .catch(err => console.log(err));
  };
  validateDNI;

  return (
    <div className="login">
      <figure className="login-figure">
        <img alt="" src="/img/room.jpg" className="login-figure-img" />
        <div className="login-contain-logo">
          <img src="/img/dhyrium_logo.png" alt="" />
        </div>
      </figure>
      <div className="login-form">
        <div className="card-form">
          <img src="/img/dhyrium_logo.png" alt="" />

          <div className="formRecoveryPassword">
            <div className="formRecoveryPassword-header">
              <h2>Nueva Contraseña</h2>
              <p>Establece tu nueva contraseña.</p>
            </div>
            <form onSubmit={handleSubmit(sendForm)} className="formLogin">
              <div className="form-group">
                <Input
                  label="Ingrese la nueva contraseña:"
                  placeholder="Contraseña"
                  {...register('newPassword', { required: true })}
                  errors={errors}
                  type="password"
                  styleInput={2}
                />
              </div>
              <div className="form-group">
                <Input
                  errors={errorPassword}
                  name="verifyPassword"
                  onBlur={verifyPasswords}
                  placeholder="Confirmar contraseña"
                  type="password"
                  label="Confirmar contraseña:"
                  styleInput={2}
                />
              </div>

              <button type="submit" className="login-btn">
                ENVIAR
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecoveryPassword;
