import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { MenuAccess, MenuRole } from '../types';

const useRole = (route: MenuAccess, typeRol: MenuRole) => {
  const { role } = useSelector((state: RootState) => state.userSession);
  const hasAccess = role?.menuPoints.some(
    menuPoint => menuPoint.route === route && menuPoint.typeRol === typeRol
  );
  return { hasAccess };
};

export default useRole;
