import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../../store';
import { MenuAccess, MenuItem } from '../../types';
import { useEffect, useState } from 'react';

interface ProtectedRoleProps {
  menuAccess: MenuAccess;
}

const ProtectedRole = ({ menuAccess }: ProtectedRoleProps) => {
  const [menuPoints, setMenuPoints] = useState<MenuItem[] | null>(null);
  const { role } = useSelector((state: RootState) => state.userSession);
  useEffect(() => {
    if (!role) return;
    setMenuPoints(role.menuPoints);
  }, [role]);
  if (!menuPoints) return null;
  const menusAccess: MenuAccess[] = menuPoints.map(menu => menu.route);
  const isAuthRole = menusAccess.includes(menuAccess);
  if (!isAuthRole) return <Navigate to="/home" />;
  return <Outlet />;
};

export default ProtectedRole;
