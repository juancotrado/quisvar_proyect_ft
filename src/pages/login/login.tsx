import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import axios from 'axios';

import { UserLogin } from '../../interfaces/intefaces';
import { axiosInstance } from '../../services/axiosInstance';

const InitDataValues = {
  email: '',
  password: '',
};
const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<UserLogin>(InitDataValues);

  const debounceRef = useRef<NodeJS.Timeout>();

  const sendForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = data;
    const body = {
      email,
      password,
    };
    try {
      const response = await axiosInstance.post('/auth/login', body);
      const personalData = {
        id: response.data.id,
        name: response.data.profile.firstName,
        lastName: response.data.profile.lastName,
        role: response.data.role,
      };
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('personalData', JSON.stringify(personalData));
      navigate('/home');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
      }
    }
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/home');
    }
  }, [navigate]);

  const handleLogin = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setData({
        ...data,
        [name]: value,
      });
    }, 200);
  };

  return (
    <div className="login">
      <figure className="login-figure">
        <img alt="" src="/img/image_example.png" className="login-figure-img" />
        <div className="login-contain-logo">
          <img src="/img/quisvar_logo2.png" alt="" />
        </div>
      </figure>
      <div className="login-form">
        <form onSubmit={sendForm} className="form">
          <img src="/img/quisvar_logo2.png" alt="" />
          <div className="form-group">
            <label htmlFor="email" className="login-label">
              CORREO
            </label>
            <input
              type="text"
              id="email"
              onChange={handleLogin}
              name="email"
              className="login-input"
              placeholder="Email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="login-label">
              CONTRASEÑA
            </label>
            <input
              type="password"
              id="password"
              onChange={handleLogin}
              name="password"
              className="login-input"
              placeholder="Contraseña"
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
