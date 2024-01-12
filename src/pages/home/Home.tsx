import './home.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useCallback, useEffect, useState } from 'react';
import { axiosInstance } from '../../services/axiosInstance';
import { licenseList } from '../../types/types';
import formatDate from '../../utils/formatDate';
const GMT = 5 * 60 * 60 * 1000;

export const Home = () => {
  const { userSession } = useSelector((state: RootState) => state);
  const [licenseData, setLicenseData] = useState<licenseList>();
  const [viewCard, setViewCard] = useState<boolean>(false);
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
    axiosInstance
      .get<licenseList[]>(`/license/employee/${userSession.id}`)
      .then(res => {
        if (res.data[0]?.status === 'ACTIVO') {
          setLicenseData(res.data[0]);
        }
        if (res.data[0]?.status === 'INACTIVO' && !res.data[0].fine) {
          setLicenseData(res.data[0]);
          setViewCard(true);
        }
      });
  }, [userSession.id]);
  useEffect(() => {
    if (licenseData && !licenseData.fine) {
      const now = new Date();
      const untilDate = new Date(licenseData.untilDate);
      const timeDifference = untilDate.getTime() + GMT - now.getTime();
      if (timeDifference >= 0) {
        setTimeout(() => {
          viewLicense();
        }, timeDifference);
      }
    }
  }, [licenseData, viewLicense]);

  useEffect(() => {
    if (userSession.id !== 0) {
      viewLicense();
    }
  }, [userSession.id, viewLicense]);
  const getDate = (value: string) => {
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
  const calculateFineState = () => {
    if (!licenseData || !licenseData.untilDate) {
      return ''; // No hay datos suficientes para calcular el estado
    }

    const now = new Date();
    const untilDate = new Date(licenseData.untilDate);
    const timeDifference = now.getTime() - (untilDate.getTime() + GMT);
    // console.log(timeDifference);
    if (timeDifference >= 20 * 60 * 1000) {
      return 'MUY_GRAVE';
    } else if (timeDifference >= 15 * 60 * 1000) {
      return 'GRAVE';
    } else if (timeDifference >= 10 * 60 * 1000) {
      return 'SIMPLE';
    } else if (timeDifference >= 3 * 60 * 1000) {
      return 'TARDE';
    }

    return 'PUNTUAL';
  };
  const handleCheckout = () => {
    const now = new Date();
    now.setHours(now.getHours() - 5);
    axiosInstance
      .patch(`/license/${licenseData?.id}`, {
        checkout: now,
        fine: calculateFineState(),
      })
      .then(() => {
        setViewCard(false);
        viewLicense();
      });
  };

  return (
    <div className="home">
      <h1 className="home-title">
        BIENVENID@{' '}
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
      {viewCard && licenseData && (
        <div className="home-license-card">
          <h2>Licencia activa</h2>
          <div className="hl-info">
            <p className="hl-details">
              Recuerda que: 3 min de retraso se considera TARDE, pasado los 10
              min se considera FALTA SIMPLE, pasado los 15 min se considera
              FALTA GRAVE, pasado los 20 min se considera FALTA MUY GRAVE.
            </p>
          </div>
          <div className="hl-info">
            <div className="hl-date">
              <h4>Salida:</h4>
              <p>{getDate(licenseData.startDate)}</p>
            </div>
            <div className="hl-date">
              <h4>Retorno:</h4>
              <p>{getDate(licenseData.untilDate)}</p>
            </div>
          </div>
          <button
            className="hl-btn btn-color-2"
            onClick={handleCheckout}
            // disabled={enableBtn}
          >
            Marcar llegada
          </button>
        </div>
      )}
    </div>
  );
};
