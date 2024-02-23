import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { MenuAccess } from '../types';
import { useLocation } from 'react-router-dom';

const useSubMenus = (menu: MenuAccess | null = null) => {
  const location = useLocation();
  const currentUrl = menu ?? (location.pathname.split('/')[1] as MenuAccess);

  const { role } = useSelector((state: RootState) => state.userSession);

  const findMenuPoint = role?.menuPoints.find(
    menuPoint => menuPoint.route === currentUrl
  );
  return { subMenu: findMenuPoint?.menu ?? [] };
};

export default useSubMenus;
