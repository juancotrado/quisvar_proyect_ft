import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Header } from '..';
import { errorToken$, toggle$ } from '../../services/sharingSubject';
import { useDispatch } from 'react-redux';
import { getUserSession } from '../../store/slices/userSession.slice';
import { AppDispatch } from '../../store';
import { useEffect, useRef } from 'react';
import { SocketProvider } from '../../context/SocketContex';
import { Subscription } from 'rxjs';
import { getListUsers } from '../../store/slices/listUsers.slice';
import './protecdRoute.css';
import { getListStage } from '../../store/slices/listStages.slice';

export const ProtectedRoute = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const isLogged = localStorage.getItem('token');
  const clossToggle = () => (toggle$.setSubject = false);

  useEffect(() => {
    dispatch(getUserSession());
    dispatch(getListUsers());
    dispatch(getListStage());
  }, [dispatch]);

  const handleErrorToken = useRef<Subscription>(new Subscription());

  useEffect(() => {
    handleErrorToken.current = errorToken$.getSubject.subscribe(() =>
      navigate('login')
    );
    return () => {
      handleErrorToken.current.unsubscribe();
    };
  }, [navigate]);

  if (!isLogged) {
    return <Navigate to="/login" />;
  }

  return (
    <SocketProvider>
      <div className="app-container">
        <Header />
        <div className="main-container" onClick={clossToggle}>
          <Outlet />
        </div>
      </div>
    </SocketProvider>
  );
};
