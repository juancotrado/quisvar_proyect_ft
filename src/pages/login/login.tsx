import { ChangeEvent, FormEvent, useRef, useState } from 'react';

type Props = {};

const login = (props: Props) => {
  const [data, setData] = useState({});
  const debounceRef = useRef<NodeJS.Timeout>();
  const sendForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Formulario enviado');
  };
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
  return (
    <div>
      <form onSubmit={sendForm}>
        <input type="text" onChange={handleLogin} name="username" />
        <input type="password" onChange={handleLogin} name="password" />
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
};

export default login;
