import { NavLink, Outlet } from 'react-router-dom';
import './procedure.css';
import { GeneralTitle } from '../../components';
import { useSubMenus } from '../../hooks';
const Procedure = () => {
  const { subMenu } = useSubMenus();

  return (
    <div className="procedure">
      <div className="procedure-header">
        <GeneralTitle firstTitle="TRAMITES DE " secondTitle="USUARIO" />
        <div className="procedure-header-menus">
          {subMenu.map(header => (
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
      </div>
      <Outlet />
    </div>
  );
};

export default Procedure;
