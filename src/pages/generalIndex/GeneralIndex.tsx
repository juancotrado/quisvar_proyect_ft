import { NavLink, Outlet } from 'react-router-dom';
import './generalIndex.css';

const indexData = [
  { id: 14, name: 'CAEC', route: 'contratos' },
  { id: 13, name: 'DEE', route: 'contratos1' },
  { id: 12, name: 'DEP', route: 'contratos2' },
  { id: 11, name: 'CF', route: 'contratos3' },
  { id: 10, name: 'DCA,CC', route: 'contratos4' },
  { id: 9, name: 'SUNAT', route: 'contratos5' },
  { id: 8, name: 'OSCE', route: 'contratos6' },
  { id: 7, name: 'Imagen Inst', route: 'contratos7' },
  { id: 6, name: 'CPE', route: 'contratos8' },
  { id: 5, name: 'DIEB', route: 'contratos8' },
  { id: 4, name: 'DRP', route: 'contratos8' },
  { id: 3, name: 'DPP', route: 'contratos8' },
  { id: 2, name: 'AC', route: 'contratos8' },
  { id: 1, name: 'DTI', route: 'contratos8' },
];

const GeneralIndex = () => {
  return (
    <div className="generalIndex">
      <div className="generalIndex-header">
        <div className="generalIndex-header-search">
          <div className="generalIndex-header-search-company">
            <figure className="generalIndex-header-figure">
              <img src="/svg/search.svg" alt="W3Schools" />
            </figure>
            <span>Dhyrium SAA</span>
            <figure className="generalIndex-header-figure">
              <img src="/img/quisvar_logo.png" alt="W3Schools" />
            </figure>
          </div>
          <input
            type="text"
            className="generalIndex-header-input"
            placeholder="Buscar documentos, profesionales o empresas"
          />
        </div>
        <div className="generalIndex-header-indexData">
          {indexData.map(index => (
            <NavLink key={index.id} to={index.route}>
              {({ isActive }) => (
                <span
                  className={
                    isActive
                      ? ' generalIndex-header-indexData-span generalIndex--active '
                      : 'generalIndex-header-indexData-span'
                  }
                >
                  {index.id} {index.name}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default GeneralIndex;
