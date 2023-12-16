import CardRegisterContract from '../../../components/shared/card/cardRegisterContract/CardRegisterContract';
import { isOpenCardRegisteContract$ } from '../../../services/sharingSubject';
import './contracts.css';

const Contracts = () => {
  const addContract = () => {
    isOpenCardRegisteContract$.setSubject = { isOpen: true };
  };
  return (
    <div className="contracts">
      <div className="contracts-sidebar">
        <h2 className="contracts-sidebar-tilte">14.CONTRATOS EN ACTIVIDAD</h2>
        <div className="contracts-add-content" onClick={addContract}>
          <span className="contracts-add-span">Añadir Contrato</span>
          <figure className="contracts-sideba-figure">
            <img src="/svg/plus.svg" alt="W3Schools" />
          </figure>
        </div>
      </div>
      <CardRegisterContract />
    </div>
  );
};

export default Contracts;
