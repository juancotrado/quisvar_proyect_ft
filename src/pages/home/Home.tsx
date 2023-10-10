import './home.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const Home = () => {
  const { userSession } = useSelector((state: RootState) => state);

  const navigate = useNavigate();
  const handleNavigateToAreas = () => navigate('/especialidades');
  const handleNavigateMyWorks = () => navigate('/mis-tareas');
  const handleNavigateReports = () => navigate('/lista-de-notificaciones');
  const handleNavigateMyAdmin = () => {
    if (userSession.role !== 'EMPLOYEE') {
      handleNavigateReports();
    } else {
      handleNavigateMyWorks();
    }
  };
  return (
    <div className="home">
      <h1 className="home-title">
        BIENVENIDO{' '}
        <span className="title-content-span">
          {userSession?.profile.firstName}
        </span>
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
          onClick={handleNavigateMyAdmin}
        >
          Tus tareas
        </button>
        <button
          className="home-btn btn-color-2"
          onClick={handleNavigateToAreas}
        >
          Proyectos
        </button>
      </div>
    </div>
  );
};

export default Home;
