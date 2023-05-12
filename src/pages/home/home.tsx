import { useEffect, useState } from 'react';
import './home.css';
// interface HomePageProps {};

const Home = () => {
  const [firstName, setFirstName] = useState('');
  useEffect(() => {
    const name = localStorage.getItem('name') || 'unknow';
    setFirstName(name);
  }, []);

  return (
    <div className="container-home">
      <div className="title-content">
        <h1>
          BIENVENIDO <span>{firstName}</span>
        </h1>
      </div>
      <p className="paragraph">
        ¡Bienvenido a nuestro sistema de asignación de tareas! Aquí podrás
        asignar y gestionar tareas de manera eficiente en tan solo unos pocos
        clics. Simplifica tu vida y aumenta la productividad de tu equipo con
        nuestra plataforma.
      </p>
      <div className="btn-section">
        <button className="home-btn btn-color-1">Tus tareas</button>
        <button className="home-btn btn-color-2">Lista de Tareas</button>
      </div>
    </div>
  );
};

export default Home;
