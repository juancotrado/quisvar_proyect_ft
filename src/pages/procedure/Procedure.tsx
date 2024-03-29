import { NavLink, Outlet } from 'react-router-dom';
import './procedure.css';
import { GeneralTitle, ButtonHeader } from '../../components';
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
                <ButtonHeader isActive={isActive} text={header.title} />
              )}
            </NavLink>
          ))}
        </div>
      </div>
      <div className="procedure-main">
        <Outlet />
      </div>
    </div>
  );
};

export default Procedure;
