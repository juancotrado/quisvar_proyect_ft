import { Navigate, Outlet } from 'react-router-dom';
import { Header } from '..';

export const ProtectedRoute = () => {
  const isLogged = localStorage.getItem('token');
  if (isLogged) {
    return (
      <div style={{ height: '100vh', backgroundColor: '#f7f7f7' }}>
        <Header />
        <Outlet />
      </div>
    );
  } else {
    return <Navigate to="/login" />;
  }
};
