import './notFound.css';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigation = useNavigate();

  const handleReturn = () => navigation('login');

  return (
    <div className="notFound">
      <figure className="notFound-figure">
        <img
          alt="cohete"
          src="/img/rocket.png"
          className="notFound-figure-img"
        />
      </figure>
      <div className="notFound-group">
        <label className="notFound-title">Ooops! - 404</label>
        <p className="notFound-paragraph">
          Lo sentimos, parece que no podemos encontrar lo
          <span className="notFound-span">que estás buscando.</span>Ha
          aterrizado en una URL que no parece existir.
        </p>
        <input
          type="button"
          onClick={handleReturn}
          value="VOLVER"
          className="notFound-btn"
        />
      </div>
      <div className="notFound-contain-logo">
        <img src="/img/quisvar_logo.png" alt="logo" />
      </div>
    </div>
  );
};

export default NotFound;
