import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../utils/images/quisvar_logo.png';
import loginImg from '../../utils/images/image_example.png';
import './login.css';

type Props = {};

const login = (props: Props) => {
  const navigate = useNavigate();
  const myRef = useRef(null);
  const [data, setData] = useState({});
  const debounceRef = useRef<NodeJS.Timeout>();
  const sendForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Formulario enviado');
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
    console.log(debounceRef.current);
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
    }, 1000);
  };
  const handleEnter = () => {
    localStorage.setItem('token', 'true');
    navigate('/home');
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
              name="username"
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
