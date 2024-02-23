import { Navigate } from 'react-router-dom';
import { useSubMenus } from '../hooks';
import { MenuAccess } from '../types';

interface NavigationSubMenuProps {
  menu?: MenuAccess;
}

const NavigationSubMenu = ({ menu }: NavigationSubMenuProps) => {
  const { subMenu } = useSubMenus(menu);
  return subMenu.length !== 0 ? (
    <Navigate to={subMenu[0].route} replace />
  ) : (
    <Navigate to={'home'} replace />
  );
};

export default NavigationSubMenu;
