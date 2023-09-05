import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../../../store';
import { UserRoleType } from '../../../types/types';

interface ProtectedRoleProps {
  rols: UserRoleType[];
}

const ProtectedRole = ({ rols }: ProtectedRoleProps) => {
  const { role } = useSelector((state: RootState) => state.userSession);
  const isAuthRole = rols.includes(role);
  if (!isAuthRole) {
    return <Navigate to="/home" />;
  }
  return <Outlet />;
};

export default ProtectedRole;
