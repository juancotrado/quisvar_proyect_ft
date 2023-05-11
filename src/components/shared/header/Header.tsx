import { useEffect } from 'react';
import './header.css';
import { NavLink, useNavigate } from 'react-router-dom';

const items = [
  { title: 'Inicio', link: '/home' },
  { title: 'Tareas', link: '/dashboard' },
  { title: 'Areas', link: '/dashboard' },
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
    navigate('login');
  };
  useEffect(() => {
    const links = document.querySelectorAll(
      '.item-text'
    ) as NodeListOf<HTMLAnchorElement>;

    links.forEach(link => {
      if (link.href === window.location.href) {
        link.classList.add('active');
      }

      const handleClick = (event: MouseEvent) => {
        event.preventDefault();
        link.classList.add('clicked');
        window.location.href = link.href;
      };

      const handleMouseOver = () => {
        if (!link.classList.contains('clicked')) {
          link.classList.add('active');
        }
      };

      const handleMouseOut = () => {
        if (!link.classList.contains('clicked')) {
          link.classList.remove('active');
        }
      };

      link.addEventListener('click', handleClick);
      link.addEventListener('mouseover', handleMouseOver);
      link.addEventListener('mouseout', handleMouseOut);

      return () => {
        link.removeEventListener('click', handleClick);
        link.removeEventListener('mouseover', handleMouseOver);
        link.removeEventListener('mouseout', handleMouseOut);
      };
    });
  }, []);

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
                isActive ? 'item-nav' : 'item-nav-false'
              }
            >
              {item.title}
            </NavLink>
            {/* <a href={item.link} className="item-text">
              {item.title}
            </a> */}
          </li>
        ))}
      </ul>
      <input
        className="input__search"
        type="text"
        placeholder="Search"
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
