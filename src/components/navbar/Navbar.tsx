import { NavLink, To } from 'react-router-dom';
import './navbar.css';
import { NavbarButton } from '../../components/navbarButton';
import { Key } from 'react';

interface NavbarProps {
  title?: string;
  subMenu?: Array<{
    id: Key | null | undefined;
    route: To;
    title: string;
  }>;
}

const Navbar = ({ title = 'Default Title', subMenu = [] }: NavbarProps) => {
  return (
    <div className="navbar-header">
      <p className="navbar-title">{title}</p>
      <div className="navbar-header-menus">
        {subMenu.map(header => (
          <NavLink key={header.id} to={header.route}>
            {({ isActive }) => (
              <NavbarButton isActive={isActive} text={header.title} />
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
