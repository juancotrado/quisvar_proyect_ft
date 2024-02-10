import { NavLink, Outlet } from 'react-router-dom';
import './project.css';
import { PROJECT_OPTIONS } from './models';

export const Project = () => {
  return (
    <div className="project">
      <div className="project-options">
        {PROJECT_OPTIONS.map(option => (
          <NavLink to={option.navigation} key={option.id}>
            {({ isActive }) => (
              <span
                className={`project-header-btn ${
                  isActive && 'project-header-btn-selected'
                } `}
              >
                <img
                  src={`svg/${isActive ? option.iconOn : option.iconOff}.svg`}
                  className="project-img-icon"
                />
                <span className="project-span-text">{option.text}</span>
              </span>
            )}
          </NavLink>
        ))}
      </div>
      <div className="project-content">
        <Outlet />
      </div>
    </div>
  );
};
