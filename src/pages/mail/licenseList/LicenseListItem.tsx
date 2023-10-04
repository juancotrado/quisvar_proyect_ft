import Button from '../../../components/shared/button/Button';
import ButtonDelete from '../../../components/shared/button/ButtonDelete';
import './LicenseListItem.css';
type license = {
  isEmployee: boolean;
};
const LicenseListItem = ({ isEmployee }: license) => {
  return (
    <div
      className={`license-item-content ${
        isEmployee ? 'license-employee' : 'license-admin'
      }`}
    >
      <div className="license-header-items">1</div>
      {!isEmployee && <div className="license-header-items">solicitante</div>}
      <div className="license-header-items">fecha de envío</div>
      <div className="license-header-items">Dia libre</div>
      <div className="license-header-items">Pendiente</div>
      <div className="license-header-items">23/05/21</div>
      <div className="license-header-items">23/05/23</div>
      <div className="license-header-items">observación</div>
      <div className="license-header-btns">
        {!isEmployee ? (
          <>
            <button type="submit" className="license-btn-action">
              <img
                src="/svg/check-blue.svg"
                style={{ width: '20px', height: '20px' }}
              />
              Aprobar
            </button>
            <button
              //   onClick={() => {
              //     setBtnActive(false);
              //     reset();
              //   }}
              className="license-btn-action"
            >
              <img
                src="/svg/cross-red.svg"
                style={{ width: '20px', height: '20px' }}
              />
              Rechazar
            </button>
          </>
        ) : (
          <div className="col-span actions-container">
            <Button
              icon="pencil"
              className="role-btn"
              // onClick={onUpdate}
            />
            <ButtonDelete
              icon="trash"
              // disabled={user.id === userSession.id}
              // url={`/users/${user.id}`}
              className="role-delete-icon"
              // onSave={getUsers}
              passwordRequired
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LicenseListItem;
