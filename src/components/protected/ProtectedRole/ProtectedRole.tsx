import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../../../store';
import { UserRoleType } from '../../../types/types';
import { useEffect, useState } from 'react';

interface ProtectedRoleProps {
  rols: UserRoleType[];
}

const ProtectedRole = ({ rols }: ProtectedRoleProps) => {
  const [rol, setRol] = useState<UserRoleType | null>(null);
  const { role } = useSelector((state: RootState) => state.userSession);
  useEffect(() => {
    setRol(role);
  }, [role]);

  if (rol === 'EMPLOYEE' || !rol) return null;
  const isAuthRole = rols.includes(role);
  if (!isAuthRole) return <Navigate to="/home" />;
  return <Outlet />;
};

export default ProtectedRole;
