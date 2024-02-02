import { NavLink, Navigate, Outlet } from 'react-router-dom';
import './userCenter.css';
import { GeneralTitle } from '../../components';
import { HEADER_USER_MODEL } from './models/userModelDef';

const UserCenter = () => {
  return (
    <div className="userCenter">
      <div className="userCenter-header">
        <GeneralTitle firstTitle="CENTRO DE" secondTitle="USUARIOS" />
        <div className="user-header-menus">
          {HEADER_USER_MODEL.map(header => (
            <NavLink key={header.id} to={header.route}>
              {({ isActive }) => (
                <span
                  className={`header-link-span ${
                    isActive && 'header-link--active'
                  }`}
                >
                  {header.title}
                </span>
              )}
            </NavLink>
          ))}
        </div>
        <div />
      </div>
      <Outlet />
    </div>
  );
};

export default UserCenter;
