import './header.css';
import { NavLink, useNavigate } from 'react-router-dom';

const items = [
  { title: 'Inicio', link: '/home' },
  { title: 'Tareas', link: '/dashboard' },
  { title: 'Areas', link: '/tasks' },
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
    <header className="nav-container">
      <figure className="header__figure">
        <img src="/img/quisvar_logo.png" alt="" />
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
        className="input__search"
        type="text"
        placeholder="Buscar"
        // value=""
      ></input>
      <ul className="icons-list">
        {icons.map((icon, id) => (
          <li key={id} onClick={handleLogout}>
            <img src={icon.name} alt={icon.name} className="icon" />
          </li>
        ))}
      </ul>
    </header>
  );
};

export default Header;
