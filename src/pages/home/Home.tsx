import './home.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useCallback, useEffect, useState } from 'react';
import { axiosInstance } from '../../services/axiosInstance';
import { licenseList } from '../../types/types';
import formatDate from '../../utils/formatDate';

const Home = () => {
  const { userSession } = useSelector((state: RootState) => state);
  const [licenseData, setLicenseData] = useState<licenseList[]>([]);
  const [enableBtn, setEnableBtn] = useState<boolean>(false);
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
  const viewLicense = useCallback(() => {
    axiosInstance.get(`/license/employee/${userSession.id}`).then(res => {
      setLicenseData(res.data);
      setEnableBtn(res.data[0]?.status === 'ACTIVE');
    });
  }, [userSession.id]);

  useEffect(() => {
    if (userSession.id !== 0) {
      viewLicense();
    }
  }, [userSession.id, viewLicense]);
  const getDate = (value: string) => {
    const GMT = 5 * 60 * 60 * 1000;
    const time = new Date(value);
    const gmtMinus5Time = new Date(time.getTime() + GMT);
    const res = formatDate(gmtMinus5Time, {
      day: '2-digit',
      weekday: 'short',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
    return res;
  };

  const handleCheckout = () => {
    const now = new Date();
    now.setHours(now.getHours() - 5);
    axiosInstance
      .patch(`/license/${licenseData[0]?.id}`, { checkout: now })
      .then(() => viewLicense());
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
      {licenseData.length > 0 &&
        licenseData[0].status === 'ACTIVE' &&
        !licenseData[0].checkout && (
          <div className="home-license-card">
            <h2>Licencia activa</h2>
            <div className="hl-info">
              <div className="hl-date">
                <h4>Salida:</h4>
                <p>{getDate(licenseData[0].startDate)}</p>
              </div>
              <div className="hl-date">
                <h4>Retorno:</h4>
                <p>{getDate(licenseData[0].untilDate)}</p>
              </div>
            </div>
            <button
              className="hl-btn btn-color-2"
              onClick={handleCheckout}
              disabled={!enableBtn}
            >
              Marcar llegada
            </button>
          </div>
        )}
    </div>
  );
};

export default Home;
