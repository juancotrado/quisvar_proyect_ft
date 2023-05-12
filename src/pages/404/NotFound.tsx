import './notFound.css';
import { NavLink } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="notFound">
      <figure className="notFound-figure">
        <img alt="" src="/img/rocket.png" className="notFound-figure-img" />
        <div className="notFound-contain-logo">
          <img src="/img/quisvar_logo2.png" alt="" />
        </div>
      </figure>
      <div className="label-group">
        <label className="notFound-label">Ooops! - 404</label>
        <p className="notFound-paragraph">
          Lo sentimos, parece que no podemos encontrar lo
        </p>
        <p className="notFound-paragraph">que estás buscando.</p>
        <p className="notFound-paragraph">
          Ha aterrizado en una URL que no parece existir.
        </p>
        {/* <button onClick={handleReturn} type="submit" className="notFound-btn">
          
        </button> */}
        <NavLink to={'login'} className={'notFound-btn'}>
          VOLVER
        </NavLink>
      </div>
    </div>
  );
};

export default NotFound;
