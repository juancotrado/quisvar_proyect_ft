import { IconAction } from '../../../../../../components';
import './LicenseListHeader.css';
type license = {
  isEmployee?: boolean;
  refresh: () => void;
};
export const LicenseListHeader = ({ isEmployee, refresh }: license) => {
  return (
    <div
      className={`license-header-content ${
        isEmployee ? 'license-employee' : 'license-admin'
      }`}
    >
      <IconAction icon="refresh" onClick={refresh} right={0.9} top={0.5} />
      <div
        className="license-header-items"
        style={{ justifyContent: 'center' }}
      >
        item
      </div>
      {!isEmployee && <div className="license-header-items">solicitante</div>}
      <div className="license-header-items">Revisado por</div>
      <div
        className="license-header-items"
        style={{ justifyContent: 'center' }}
      >
        fecha de envío
      </div>
      <div className="license-header-items">motivo</div>
      <div className="license-header-items">estado</div>
      <div className="license-header-items">salida</div>
      <div className="license-header-items">retorno</div>
      <div className="license-header-items">llegada</div>
      <div className="license-header-items">observación</div>
      <div className="license-header-items">acción</div>
    </div>
  );
};
