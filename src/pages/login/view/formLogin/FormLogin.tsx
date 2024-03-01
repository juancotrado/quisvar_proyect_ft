import { SubmitHandler, useForm } from 'react-hook-form';
import { Input } from '../../../../components';
import { axiosInstance } from '../../../../services/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { validateDNI } from '../../../../utils';
import './formLogin.css';
interface loginForm {
  dni: string;
  password: string;
}

const FormLogin = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginForm>();

  const sendForm: SubmitHandler<loginForm> = data => {
    axiosInstance
      .post('/auth/login', data)
      .then(res => {
        localStorage.setItem('token', res.data.token);
        navigate('/home');
      })
      .catch(err => console.log(err));
  };
  return (
    <form onSubmit={handleSubmit(sendForm)} className="formLogin">
      <div className="form-group">
        <Input
          label="Ingrese DNI"
          placeholder="DNI"
          {...register('dni', {
            required: true,
            validate: validateDNI,
          })}
          type="text"
          errors={errors}
        />
      </div>
      <div className="form-group">
        <Input
          label="Contraseña"
          placeholder="Contraseña"
          {...register('password', { required: true })}
          errors={errors}
          type="password"
        />
      </div>
      <button type="submit" className="login-btn">
        INGRESAR
      </button>
    </form>
  );
};

export default FormLogin;
