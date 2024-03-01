import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { FormLogin, FormRecoveryPassword } from './view';

export const Login = () => {
  const navigate = useNavigate();

  const [recoveryPassword, setRecoveryPassword] = useState(false);
  const handleRecoveryPassword = () => setRecoveryPassword(!recoveryPassword);
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
        <div className="card-form">
          <img src="/img/dhyrium_logo.png" alt="" />
          {!recoveryPassword ? <FormLogin /> : <FormRecoveryPassword />}
          <span
            className={`login-forgot-email ${
              !recoveryPassword ? 'login-text-red' : 'login-text-normal'
            } `}
            onClick={handleRecoveryPassword}
          >
            {!recoveryPassword
              ? ' ¿Olvidaste tu contraseña?'
              : '⬅ Regresar al login'}
          </span>
        </div>
      </div>
    </div>
  );
};
