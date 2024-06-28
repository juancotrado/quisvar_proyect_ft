import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  ViewHtmlToPdf,
  ViewPdf,
  ButtonDelete,
  AlertNotification,
  ConfirmAction,
} from '../../components';
import { errorToken$, toggle$ } from '../../services/sharingSubject';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { useEffect, useRef } from 'react';
import { SocketProvider } from '../../context/SocketContex';
import { Subscription } from 'rxjs';
import './protecdRoute.css';
import { getAllServices } from '../../store/thunks/getAllInitServices..thunks';
import { CardOpenFile } from '../../pages/userCenter/pages/users/views';

export const ProtectedRoute = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const isLogged = localStorage.getItem('token');
  const clossToggle = () => (toggle$.setSubject = false);

  useEffect(() => {
    dispatch(getAllServices());
  }, []);

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
        <Sidebar />
        <div className="main-container" onClick={clossToggle}>
          <Outlet />
        </div>
        <AlertNotification />
        <ButtonDelete notIsVisible />
        <ViewPdf />
        <ViewHtmlToPdf />
        <ConfirmAction />
      </div>
    </SocketProvider>
  );
};
