import './home.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useCallback, useEffect, useState } from 'react';
import { axiosInstance } from '../../services/axiosInstance';
import { licenseList } from '../../types';
import { formatDate } from '../../utils';
import { Button, IconAction } from '../../components';
import { isOpenCardFiles$ } from '../../services/sharingSubject';
import CardMoreOptions from './views/CardMoreOptions';
const GMT = 5 * 60 * 60 * 1000;
type LicenseRes = {
  licenses: licenseList[];
  count: number;
};
export const Home = () => {
  const { id, profile } = useSelector((state: RootState) => state.userSession);
  const [licenseData, setLicenseData] = useState<licenseList>();
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewCard, setViewCard] = useState<boolean>(false);
  const [disabledBtn, setDisabledBtn] = useState<boolean>(true);

  const navigate = useNavigate();
  const handleNavigateToAreas = () => navigate('/especialidades');
  // const handleNavigateMyWorks = () => navigate('/mis-tareas');
  // const handleNavigateReports = () => navigate('/lista-de-notificaciones');
  const handleNavigateMyAdmin = () => {
    return;
    // if (role !== 'EMPLOYEE') {
    //   handleNavigateReports();
    // } else {
    //   handleNavigateMyWorks();
    // }
  };
  const viewLicense = useCallback(() => {
    const now = new Date();
    const early = 2 * 60 * 60 * 1000;
    axiosInstance
      .get<LicenseRes>(`/license/employee/${id}`, {
        headers: {
          noLoader: true,
        },
      })
      .then(res => {
        const untilDate = new Date(
          new Date(res.data.licenses[0].untilDate).getTime() + GMT
        );
        const timer = now.getTime() > untilDate.getTime() - early;
        if (
          res.data.licenses[0]?.status === 'ACTIVO' &&
          !res.data.licenses[0].fine
        ) {
          setLicenseData(res.data.licenses[0]);
          setViewCard(true);
        }
        if (
          res.data.licenses[0]?.status === 'ACTIVO' &&
          timer &&
          !res.data.licenses[0].fine
        ) {
          setLicenseData(res.data.licenses[0]);
          setViewCard(true);
          setDisabledBtn(false);
        }
        if (
          res.data.licenses[0]?.status === 'INACTIVO' &&
          !res.data.licenses[0].fine
        ) {
          setLicenseData(res.data.licenses[0]);
          setViewCard(true);
          setDisabledBtn(false);
        }
      });
  }, [id]);
  useEffect(() => {
    if (licenseData && !licenseData.fine) {
      const now = new Date();
      const early = 2 * 60 * 60 * 1000;
      const untilDate = new Date(
        new Date(licenseData.untilDate).getTime() + GMT
      );
      const timeDifference = now.getTime() - (untilDate.getTime() - early);
      if (timeDifference < 0) {
        setTimeout(() => {
          viewLicense();
        }, Math.abs(timeDifference));
      }
    }
  }, [licenseData, viewLicense]);

  useEffect(() => {
    if (id !== 0) {
      viewLicense();
    }
  }, [id, viewLicense]);
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
    console.log(res);
    return res;
  };
  const calculateFineState = () => {
    if (!licenseData || !licenseData.untilDate) {
      return ''; // No hay datos suficientes para calcular el estado
    }

    const now = new Date();
    const untilDate = new Date(licenseData.untilDate);
    const timeDifference = now.getTime() - (untilDate.getTime() + GMT);
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
      .patch(`/license/checkout/${licenseData?.id}`, {
        checkout: now,
        fine: calculateFineState(),
        status: 'INACTIVO',
      })
      .then(() => {
        setViewCard(false);
        setDisabledBtn(true);
        viewLicense();
      });
  };
  const handleOpenCardFiles = () => {
    isOpenCardFiles$.setSubject = {
      isOpen: true,
    };
  };
  return (
    <div className="home">
      <IconAction
        icon="more-options"
        size={2}
        onClick={() => setIsExpanded(!isExpanded)}
      />
      {isExpanded && <CardMoreOptions />}
      <h1 className="home-title">
        {profile.gender === 'F' ? (
          <>
            BIENVENIDA{' '}
            <span className="title-content-span">{profile.firstName}</span>
          </>
        ) : (
          <>
            BIENVENIDO{' '}
            <span className="title-content-span">{profile.firstName}</span>
          </>
        )}
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

      <Button text="Ver Directivas" onClick={handleOpenCardFiles} />
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
            className={`hl-btn ${!disabledBtn && 'btn-color-2'}`}
            onClick={handleCheckout}
            disabled={disabledBtn}
          >
            Marcar llegada
          </button>
        </div>
      )}
    </div>
  );
};
