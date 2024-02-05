import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { MenuAccess, MenuRole } from '../types';
import { useLocation } from 'react-router-dom';

const useRole = (
  typeRol: MenuRole,
  menu: MenuAccess | null,
  subMenu?: string
) => {
  const location = useLocation();
  const currentUrl = menu ?? (location.pathname.split('/')[1] as MenuAccess);

  const { role } = useSelector((state: RootState) => state.userSession);
  let hasAccess: boolean | undefined = false;
  if (subMenu) {
    const findMenu = role?.menuPoints.find(
      menuPoint => menuPoint.route === currentUrl
    );
    hasAccess = findMenu?.menu?.some(
      menuPoint => menuPoint.route === subMenu && menuPoint.typeRol === typeRol
    );
  } else {
    hasAccess = role?.menuPoints.some(
      menuPoint =>
        menuPoint.route === currentUrl && menuPoint.typeRol === typeRol
    );
  }

  return { hasAccess: !!hasAccess };
};

export default useRole;
