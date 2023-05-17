import { Navigate, Outlet } from 'react-router-dom';
import { Header } from '..';
import { toggle$ } from '../../services/sharingSubject';

export const ProtectedRoute = () => {
  const isLogged = localStorage.getItem('token');
  const clossToggle = () => (toggle$.setSubject = false);

  if (isLogged) {
    return (
      <div style={{ height: '100vh', backgroundColor: '#f5f5f5' }}>
        <Header />
        <div onClick={clossToggle}>
          <Outlet />
        </div>
      </div>
    );
  } else {
    return <Navigate to="/login" />;
  }
};
