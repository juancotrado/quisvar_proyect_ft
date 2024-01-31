import { NavLink, Outlet } from 'react-router-dom';
import './project.css';
import { PROJECT_OPTIONS } from './models';

export const Project = () => {
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
