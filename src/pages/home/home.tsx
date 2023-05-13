import { useEffect, useState } from 'react';
import './home.css';
import { useNavigate } from 'react-router-dom';
// interface HomePageProps {};

const Home = () => {
  const [firstName, setFirstName] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem('name') || 'unknow';
    setFirstName(name);
  }, []);

  const handleNavigate = () => navigate('/areas');
  return (
    <div className="home">
      <h1 className="home-title">
        BIENVENIDO <span className="title-content-span">{firstName}</span>
      </h1>
      <p className="paragraph">
        ¡Bienvenido a nuestro sistema de asignación de tareas! Aquí podrás
        asignar y gestionar tareas de manera eficiente en tan solo unos pocos
        clics. Simplifica tu vida y aumenta la productividad de tu equipo con
        nuestra plataforma.
      </p>
      <div className="btn-section">
        <button className="home-btn btn-color-1">Tus tareas</button>
        <button className="home-btn btn-color-2" onClick={handleNavigate}>
          Áreas
        </button>
      </div>
    </div>
  );
};

export default Home;
