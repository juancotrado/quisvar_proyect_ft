import './contracts.css';

const Contracts = () => {
  const addContract = () => {};
  return (
    <div className="contracts">
      <div className="contracts-sidebar">
        <h2>14.CONTRATOS EN ACTIVIDAD</h2>
        <div className="contracts-add-content" onClick={addContract}>
          <span className="contracts-add-span">Añadir Contrato</span>
          <figure className="cardSubtask-figure">
            <img src="/svg/plus.svg" alt="W3Schools" />
          </figure>
        </div>
      </div>
    </div>
  );
};

export default Contracts;
