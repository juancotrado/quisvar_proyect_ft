import { motion } from 'framer-motion';
import './header.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Subscription } from 'rxjs';
import { toggle$ } from '../../../services/sharingSubject';

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

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    navigate('login');
  };

  const items = [
    { title: 'Inicio', link: '/home' },
    { title: 'Tareas', link: '/tareas' },
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
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="header-toggle"
          >
            <motion.li
              whileTap={{ scale: 0.9 }}
              onClick={() => console.log('hola')}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              {' '}
              &#127814; Perfil
            </motion.li>
            <li
              onClick={() => console.log('hola')}
              style={{ cursor: 'pointer' }}
            >
              {' '}
              &#127814; Opcion 2
            </li>
            <li
              onClick={() => console.log('hola')}
              style={{ cursor: 'pointer' }}
            >
              {' '}
              &#127814; Option 3
            </li>
            <motion.li
              whileTap={{ scale: 0.9 }}
              onClick={() => handleLogout()}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              {' '}
              &#127814; Salir
            </motion.li>
          </motion.ul>
        )}
      </nav>
    </header>
  );
};

export default Header;
