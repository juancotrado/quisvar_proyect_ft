import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import './project.css';
import { useEffect } from 'react';
import { PROJECT_OPTIONS } from './models';

export const Project = () => {
  const navigation = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const pathnameSplit = location.pathname.split('/');
    if (pathnameSplit.length === 6) navigation('presupuestos');
  }, [location.pathname, navigation]);

  return (
    <div className="project">
      <div className="project-options">
        {PROJECT_OPTIONS.map(option => (
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
