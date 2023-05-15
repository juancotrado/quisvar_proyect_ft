import { motion } from 'framer-motion';
import './header.css';
import { NavLink, useNavigate } from 'react-router-dom';

const items = [
  { title: 'Inicio', link: '/home' },
  { title: 'Tareas', link: '/tareas' },
  { title: 'Areas', link: '/areas' },
];
const icons = [
  { name: '/svg/bell.svg', link: '/dashboard' },
  { name: '/svg/question-circle.svg', link: '/dashboard' },
  { name: '/svg/icon.svg', link: '/dashboard' },
  { name: '/svg/Profile Avatar.svg', link: '/dashboard' },
];

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    navigate('login');
  };

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
                onClick={handleLogout}
                src={icon.name}
                alt={icon.name}
                className="icon"
              />
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
