import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { axiosInstance } from '../../services/axiosInstance';
import InputText from '../../components/shared/Input/Input';
import { SubmitHandler, useForm } from 'react-hook-form';
import { validateEmail } from '../../utils/customValidatesForm';

interface UserForm {
  email: string;
  password: string;
}
const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserForm>();

  const sendForm: SubmitHandler<UserForm> = data => {
    axiosInstance.post('/auth/login', data).then(res => {
      localStorage.setItem('token', res.data.token);
      navigate('/home');
    });
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
        <img alt="" src="/img/image_example.png" className="login-figure-img" />
        <div className="login-contain-logo">
          <img src="/img/dhyrium_logo.png" alt="" />
        </div>
      </figure>
      <div className="login-form">
        <form onSubmit={handleSubmit(sendForm)} className="form">
          <img src="/img/dhyrium_logo.png" alt="" />
          <div className="form-group">
            <InputText
              label="Correo"
              placeholder="Email"
              {...register('email', {
                required: true,
                validate: validateEmail,
              })}
              type="text"
              errors={errors}
            />
          </div>
          <div className="form-group">
            <InputText
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
      </div>
    </div>
  );
};

export default Login;
