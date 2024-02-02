import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { MenuAccess, MenuRole } from '../types';
import { useLocation } from 'react-router-dom';

const useRole = (typeRol: MenuRole) => {
  const location = useLocation();
  const currentUrl = location.pathname.split('/')[1] as MenuAccess;

  const { role } = useSelector((state: RootState) => state.userSession);
  const hasAccess = role?.menuPoints.some(
    menuPoint => menuPoint.route === currentUrl && menuPoint.typeRol === typeRol
  );
  return { hasAccess };
};

export default useRole;
