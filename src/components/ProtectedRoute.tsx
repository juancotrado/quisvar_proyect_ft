import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
  const isLogged = localStorage.getItem('token');
  if (isLogged) {
    return <Outlet />;
  } else {
    return <Navigate to="/login " />;
  }
};
