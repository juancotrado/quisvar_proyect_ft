import './header.css';

import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('login');
  };
  return (
    <header className="container">
      <figure className="header__figure">
        <img src="/img/quisvar_logo.png" alt="" />
      </figure>
      <input
        className="input__search"
        type="text"
        placeholder="Search"
        value=""
      ></input>
      <button onClick={handleLogout}>Logout</button>
    </header>
  );
};

export default Header;
