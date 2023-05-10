import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../utils/images/quisvar_logo.png';
import loginImg from '../../utils/images/image_example.png';
import './login.css';
// import { Alert } from '../../components';
import axios, { AxiosError } from 'axios';

import { UserLogin } from '../../interfaces/intefaces';

const InitDataValues = {
  email: '',
  password: '',
};
const login = () => {
  const navigate = useNavigate();
  const myRef = useRef(null);
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
      console.log(body);
      const response = await axios.post(
        // 'http://172.16.10.207:8081/api/v1/auth/login',
        'http://127.0.0.1:8081/api/v1/auth/login',
        body
      );
      console.log(response.data);
      // Aquí puedes manejar la respuesta del servidor
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data); // Aquí puedes manejar el error en caso de que algo haya fallado
      }
    }
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    const isFocused = myRef.current;
    if (!!isFocused && token == 'true') {
      navigate('/home');
    }
  }, [myRef]);

  const handleLogin = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      console.log({
        ...data,
        [name]: value,
      });
      setData({
        ...data,
        [name]: value,
      });
    }, 200);
  };
  const handleEnter = () => {
    console.log(debounceRef.current);

    // localStorage.setItem('token', 'true');
    // navigate('/home');
  };

  return (
    <div ref={myRef} className="main">
      <div className="container">
        <div className="login-image">
          <img
            src={loginImg}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div className="login-form">
          <form onSubmit={sendForm} className="form-data">
            <img
              src={logo}
              alt=""
              className="logo"
              style={{ width: '100%', objectFit: 'cover' }}
            />
            <label htmlFor="" className="label-text">
              Usuario
            </label>
            <input
              type="text"
              onChange={handleLogin}
              name="email"
              className="input-field"
              placeholder="Usuario"
            />
            <label htmlFor="" className="label-text">
              Contraseña
            </label>
            <input
              type="password"
              onChange={handleLogin}
              name="password"
              className="input-field"
              placeholder="Contraseña"
            />
            <button type="submit" className="btn-login" onClick={handleEnter}>
              INGRESAR
            </button>
          </form>
        </div>
        {/* <button onClick={handleEnter}>login</button> */}
      </div>
    </div>
  );
};

export default login;
