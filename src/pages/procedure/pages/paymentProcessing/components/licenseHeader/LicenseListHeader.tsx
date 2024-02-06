import './LicenseListHeader.css';
type license = {
  isEmployee?: boolean;
};
export const LicenseListHeader = ({ isEmployee }: license) => {
  return (
    <div
      className={`license-header-content ${
        isEmployee ? 'license-employee' : 'license-admin'
      }`}
    >
      <div
        className="license-header-items"
        style={{ justifyContent: 'center' }}
      >
        item
      </div>
      {!isEmployee && <div className="license-header-items">solicitante</div>}
      <div className="license-header-items">fecha de envío</div>
      <div className="license-header-items">motivo</div>
      <div className="license-header-items">estado</div>
      <div className="license-header-items">salida</div>
      <div className="license-header-items">retorno</div>
      <div className="license-header-items">observación</div>
      <div className="license-header-items">acción</div>
    </div>
  );
};
