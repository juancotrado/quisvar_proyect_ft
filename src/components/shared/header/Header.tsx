import { motion } from 'framer-motion';
import './header.css';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { Subscription } from 'rxjs';
import { toggle$ } from '../../../services/sharingSubject';
import { SocketContext } from '../../../context/SocketContex';
import { CardEditInformation, Menu } from '../..';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { assitant_perms } from '../../../utils/roles';
import { itemsAdmin, itemsEmployee } from '../../../utils/navigation/config';
import ChipItem from './chipItem/ChipItem';
import { getIconDefault } from '../../../utils/tools';

const Header = () => {
  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenMoreInfo, setIsOpenMoreInfo] = useState(false);
  const { userSession } = useSelector((state: RootState) => state);
  const handleToggleRef = useRef<Subscription>(new Subscription());

  useEffect(() => {
    handleToggleRef.current = toggle$.getSubject.subscribe((value: boolean) => {
      setIsOpen(value);
      setIsOpenMoreInfo(value);
    });
    return () => {
      handleToggleRef.current.unsubscribe();
    };
  }, []);
  const [openModalInfo, setOpenModalInfo] = useState(false);

  const handleNotification = () => {
    navigate('lista-de-notificaciones');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    socket.disconnect();
    navigate('login');
  };
  const handleHome = () => {
    navigate('/home');
  };

  const selectPdfForUserRol = () => {
    if (userSession.role === 'EMPLOYEE')
      return window.open('/public/tutorials/MANUAL_DE_USUARIO.pdf', '_blank');
    return window.open(
      '/public/tutorials/MANUAL_DE_ADMINISTRADOR.pdf',
      '_blank'
    );
  };
  const selectVideoForUserRol = () => {
    if (userSession.role === 'EMPLOYEE')
      return window.open('/public/tutorials/USER_GUIDE.mkv', '_blank');
    return window.open('/public/tutorials/ADMIN_GUIDE.mkv', '_blank');
  };

  const itemType = assitant_perms.includes(userSession.role)
    ? itemsAdmin
    : itemsEmployee;

  const openModal = () => setOpenModalInfo(true);
  const closeModal = () => setOpenModalInfo(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleMenuMoreInfo = () => setIsOpenMoreInfo(!isOpenMoreInfo);

  const icons = [
    {
      id: 1,
      name: '/svg/bell.svg',
      link: '/lista-de-notificaciones',
      action: handleNotification,
    },
    {
      id: 2,
      name: '/svg/question-circle.svg',
      link: '/dashboard',
      action: toggleMenuMoreInfo,
    },
    {
      id: 3,
      name: getIconDefault(userSession.profile.dni),
      link: '/dashboard',
      action: toggleMenu,
    },
  ];
  const menuMoreInfo = [
    {
      id: 1,
      name: 'Ver Video tutorial',
      icon: '/svg/file-video-solid.svg',
      action: selectVideoForUserRol,
    },
    {
      id: 3,
      name: 'Ver PDF',
      icon: '/svg/file-pdf-solid.svg',
      action: selectPdfForUserRol,
    },
  ];
  const menu = [
    {
      id: 1,
      name: 'Editar Perfil',
      icon: '/svg/Group.svg',
      action: openModal,
    },
    {
      id: 3,
      name: 'Acerca de',
      icon: '/svg/question-circle.svg',
      action: null,
    },
    {
      id: 4,
      name: 'Salir',
      icon: '/svg/ri_logout-box-r-line.svg',
      action: handleLogout,
    },
  ];
  return (
    <header className="header">
      <nav className="nav-container container">
        <div className="nav-options">
          <figure className="header-figure">
            <img
              className="nav-logo"
              src="/img/logo_img.png"
              onClick={handleHome}
              alt="logo QuisVar"
            />
          </figure>
          <ul className="items-list">
            {itemType.map(item => (
              <ChipItem key={item.id} item={item} />
            ))}
          </ul>
        </div>

        <ul className="icons-list">
          {icons.map(icon => (
            <li key={icon.id} className="icon-list">
              {(userSession.role !== 'EMPLOYEE' || icon.id !== 1) && (
                <figure
                  className={`${
                    icon.id === 3 ? 'user-profile-figure' : 'icon-list-item'
                  } `}
                >
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={icon.action}
                    src={icon.name}
                    alt={icon.name}
                  />
                </figure>
              )}
              {icon.id === 2 && isOpenMoreInfo && <Menu data={menuMoreInfo} />}
              {icon.id === 3 && isOpen && <Menu data={menu} />}
            </li>
          ))}
        </ul>
      </nav>
      {<CardEditInformation isOpen={openModalInfo} onClose={closeModal} />}
    </header>
  );
};

export default Header;
