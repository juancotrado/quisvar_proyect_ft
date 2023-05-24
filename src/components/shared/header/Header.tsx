import { motion } from 'framer-motion';
import './header.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Subscription } from 'rxjs';
import { toggle$ } from '../../../services/sharingSubject';
import { CardEditInformation, Menu } from '../..';

const Header = () => {
  const navigate = useNavigate();
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
    localStorage.removeItem('personalData');
    navigate('login');
  };

  const items = [
    { title: 'Inicio', link: '/home' },
    { title: 'Tareas', link: '/mis-tareas' },
    { title: 'Areas', link: '/areas' },
  ];

  const icons = [
    { name: '/svg/bell.svg', link: '/dashboard', action: handleLogout },
    {
      name: '/svg/question-circle.svg',
      link: '/dashboard',
      action: handleLogout,
    },
    { name: '/svg/icon.svg', link: '/dashboard', action: handleLogout },
    { name: '/svg/Profile Avatar.svg', link: '/dashboard', action: toggleMenu },
  ];

  const menu = [
    { name: 'Editar Perfil', icon: '/svg/Group.svg', action: openModal },
    { name: 'Configuracion', icon: '/svg/icon.svg', action: handleList },
    { name: 'Acerca de', icon: '/svg/question-circle.svg', action: () => { } },
    {
      name: 'Salir',
      icon: '/svg/ri_logout-box-r-line.svg',
      action: handleLogout,
    },
  ];

  return (
    <header className="header">
      <nav className="nav-container container">
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
        <input
          className="input-search"
          type="text"
          placeholder="Buscar"
        // value=""
        ></input>
        <ul className="icons-list">
          {icons.map((icon, id) => (
            <li key={id}>
              <motion.img
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={icon.action}
                src={icon.name}
                alt={icon.name}
                className="icon"
              />
            </li>
          ))}
        </ul>
        {isOpen && <Menu data={menu} />}
      </nav>
      {<CardEditInformation isOpen={openModalInfo} onClose={closeModal} />}
    </header>
  );
};

export default Header;
