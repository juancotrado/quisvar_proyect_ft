import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { axiosInstance } from '../../services/axiosInstance';
import { SubmitHandler, useForm } from 'react-hook-form';
import { validateDNI } from '../../utils';
import { Input } from '../../components';

interface UserForm {
  dni: string;
  password: string;
}
export const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserForm>();

  const sendForm: SubmitHandler<UserForm> = data => {
    axiosInstance
      .post('/auth/login', data)
      .then(res => {
        localStorage.setItem('token', res.data.token);
        navigate('/home');
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/home');
    }
  }, [navigate]);

  return (
    <div className="login">
      <figure className="login-figure">
        <img alt="" src="/img/room.jpg" className="login-figure-img" />
        <div className="login-contain-logo">
          <img src="/img/dhyrium_logo.png" alt="" />
        </div>
      </figure>
      <div className="login-form">
        <form onSubmit={handleSubmit(sendForm)} className="form">
          <img src="/img/dhyrium_logo.png" alt="" />
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
          <div className="login-forgot-contein">
            <p className="login-forgot-password">
              Si tiene dificultades en el acceso, solicite usuario y clave
              enviando sus datos (DNI, Apellidos y Nombres) al correo
              electronico sgte:
            </p>
            <span className="login-forgot-email">
              coorporaciondhyriumsaa@gmail.com
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};
