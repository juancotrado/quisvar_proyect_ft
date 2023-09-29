import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import './project.css';
import { useEffect } from 'react';
const projectOptions = [
  {
    id: 1,
    text: 'DATOS GENERALES',
    iconOn: 'ntbook-blue',
    iconOff: 'ntbook-black',
    navigation: 'detalles',
  },
  {
    id: 2,
    text: 'HOJA DE PRESUPUESTOS',
    iconOn: 'spread-blue',
    iconOff: 'spread-black',
    navigation: 'presupuestos',
  },
  {
    id: 3,
    text: 'BÁSICOS',
    iconOn: 'brief-blue',
    iconOff: 'brief-black',
    navigation: 'basicos',
  },
];
const Project = () => {
  const navigation = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const pathnameSplit = location.pathname.split('/');
    if (pathnameSplit.length === 6) navigation('presupuestos');
  }, [location.pathname, navigation]);

  return (
    <div className="project">
      <div className="project-options">
        {projectOptions.map(option => (
          <div key={option.id}>
            <NavLink to={option.navigation}>
              {({ isActive }) => (
                <span
                  className={
                    isActive
                      ? 'project-header-btn  project-header-btn-selected'
                      : 'project-header-btn'
                  }
                >
                  <img
                    src={`svg/${isActive ? option.iconOn : option.iconOff}.svg`}
                    className="project-img-icon"
                  />
                  <span className="project-span-text">{option.text}</span>
                </span>
              )}
            </NavLink>
          </div>
        ))}
      </div>
      <div className="project-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Project;
