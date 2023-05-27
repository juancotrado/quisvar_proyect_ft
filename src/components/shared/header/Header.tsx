import { motion } from 'framer-motion';
import './header.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { Subscription } from 'rxjs';
import { toggle$ } from '../../../services/sharingSubject';
import { SocketContext } from '../../../context/SocketContex';
import { CardEditInformation, Menu } from '../..';

const Header = () => {
  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const [isOpen, setIsOpen] = useState(false);
  const handleToggleRef = useRef<Subscription>(new Subscription());

  useEffect(() => {
    handleToggleRef.current = toggle$.getSubject.subscribe((value: boolean) =>
      setIsOpen(value)
    );
    return () => {
      handleToggleRef.current.unsubscribe();
    };
  }, []);
  const [openModalInfo, setOpenModalInfo] = useState(false);

  const openModal = () => {
    setOpenModalInfo(true);
  };

  const closeModal = () => {
    setOpenModalInfo(false);
  };
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleList = () => {
    setIsOpen(false);
    navigate('lista-de-usuarios');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    socket.disconnect();
    navigate('login');
  };

  const items = [
    { title: 'Inicio', link: '/home' },
    { title: 'Tareas', link: '/mis-tareas' },
    { title: 'Especialidades', link: '/especialidades' },
  ];

  const icons = [
    { id: 1, name: '/svg/bell.svg', link: '/dashboard', action: handleLogout },
    {
      id: 2,
      name: '/svg/question-circle.svg',
      link: '/dashboard',
      action: handleLogout,
    },
    {
      id: 3,
      name: '/svg/Profile Avatar.svg',
      link: '/dashboard',
      action: toggleMenu,
    },
  ];

  const menu = [
    {
      name: 'Editar Perfil',
      icon: '/svg/Group.svg',
      action: openModal,
    },
    { name: 'Configuracion', icon: '/svg/icon.svg', action: handleList },
    {
      name: 'Acerca de',
      icon: '/svg/question-circle.svg',
      action: () => {
        null;
      },
    },
    {
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
            <img src="/img/quisvar_logo.png" alt="logo QuisVar" />
          </figure>
          <ul className="items-list">
            {items.map((item, id) => (
              <li key={id}>
                <NavLink
                  to={item.link}
                  className={({ isActive }) =>
                    isActive ? 'item-nav-active' : 'item-nav-inactive'
                  }
                >
                  {item.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <ul className="icons-list">
          {icons.map(icon => (
            <li key={icon.id} className="icon-list">
              <motion.img
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={icon.action}
                src={icon.name}
                alt={icon.name}
                className="icon"
              />
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
