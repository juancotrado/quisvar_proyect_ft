import { useEffect, useState } from 'react';
import './home.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
// interface HomePageProps {};
const initValues = {
  name: 'unknown',
  id: null,
};
const Home = () => {
  const { userSession } = useSelector((state:RootState) => state)
  const [personalData, setPersonalData] = useState(initValues);

  const navigate = useNavigate();

  useEffect(() => {
    const personalData = localStorage.getItem('personalData') || null;
    if (!personalData) return;
    setPersonalData(JSON.parse(personalData));
  }, []);

  const handleNavigateToAreas = () => navigate('/areas');
  const handleNavigateMyWorks = () => navigate('/mis-tareas');
  return (
    <div className="home">
      <h1 className="home-title">
        BIENVENIDO{' '}
        <span className="title-content-span">{userSession?.profile.firstName}</span>
      </h1>
      <p className="paragraph">
        ¡Bienvenido a nuestro sistema de asignación de tareas! Aquí podrás
        asignar y gestionar tareas de manera eficiente en tan solo unos pocos
        clics. Simplifica tu vida y aumenta la productividad de tu equipo con
        nuestra plataforma.
      </p>
      <div className="btn-section">
        <button
          className="home-btn btn-color-1"
          onClick={handleNavigateMyWorks}
        >
          Tus tareas
        </button>
        <button
          className="home-btn btn-color-2"
          onClick={handleNavigateToAreas}
        >
          Áreas
        </button>
      </div>
    </div>
  );
};

export default Home;
