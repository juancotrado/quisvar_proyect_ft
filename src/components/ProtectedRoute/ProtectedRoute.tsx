import { Navigate, Outlet } from 'react-router-dom';
import { Header } from '..';
import { toggle$ } from '../../services/sharingSubject';
import { useDispatch } from 'react-redux';
import { getUserSession } from '../../store/slices/userSession.slice';
import { AppDispatch } from '../../store';
import { useEffect } from 'react';
import { SocketProvider } from '../../context/SocketContex';

export const ProtectedRoute = () => {
  const dispatch: AppDispatch = useDispatch();
  const isLogged = localStorage.getItem('token');
  const clossToggle = () => (toggle$.setSubject = false);

  useEffect(() => {
    dispatch(getUserSession());
  }, [dispatch]);

  if (isLogged) {
    return (
      <SocketProvider>
        <div style={{ height: '100vh', backgroundColor: '#f5f5f5' }}>
          <Header />
          <div onClick={clossToggle}>
            <Outlet />
          </div>
        </div>
      </SocketProvider>
    );
  } else {
    return <Navigate to="/login" />;
  }
};
