import { NavLink, Outlet } from 'react-router-dom';
import './project.css';
import { PROJECT_OPTIONS } from './models';
import { HeaderOptionBtn } from '../../../../components';

export const Project = () => {
  return (
    <div className="project">
      <div className="project-options">
        {PROJECT_OPTIONS.map(({ iconOff, iconOn, text, id, navigation }) => (
          <NavLink to={navigation} key={id}>
            {({ isActive }) => (
              <HeaderOptionBtn
                iconOff={iconOff}
                iconOn={iconOn}
                text={text}
                isActive={isActive}
              />
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
