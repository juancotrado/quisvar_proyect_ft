// import { Input } from '../../../components';
import { useState } from 'react';
import Button from '../../../components/shared/button/Button';
import ButtonDelete from '../../../components/shared/button/ButtonDelete';
import useListUsers from '../../../hooks/useListUsers';
import { axiosInstance } from '../../../services/axiosInstance';
import { licenseList } from '../../../types/types';
import './LicenseListItem.css';
type license = {
  isEmployee: boolean;
  data: licenseList;
  index: number;
  // onSave: void;
};

const LicenseListItem = ({ isEmployee, data, index }: license) => {
  const { users } = useListUsers();
  const [feedback, setFeedback] = useState('');
  const userName = users.find(user => data.userId === user.id);
  const handleFeedback = (e: React.FocusEvent<HTMLInputElement>) => {
    setFeedback(e.target.value);
  };
  const handleSucces = () => {
    const newLicense = {
      status: 'ACTIVE',
      feedback,
    };
    axiosInstance.patch(`/license/${data.id}`, newLicense).then(res => {
      console.log(res.data);
      // onSave;
    });
    // console.log(data.id);
  };
  return (
    <div
      className={`license-item-content ${
        isEmployee ? 'license-employee' : 'license-admin'
      }`}
    >
      <div className="license-header-items">{index + 1}</div>
      {!isEmployee && (
        <div className="license-header-items">{userName?.name}</div>
      )}
      <div className="license-header-items">{data.createdAt}</div>
      <div className="license-header-items">{data.reason}</div>
      {/* <div className="license-header-items">{data.status}</div> */}
      <div className="license-header-items">
        <span className={`card-status-message license-${data.status}`}>
          {data.status.toLowerCase()}
        </span>
      </div>
      <div className="license-header-items">{data.startDate}</div>
      <div className="license-header-items">{data.untilDate}</div>
      {!isEmployee && data.status === 'PROCESS' ? (
        <div className="license-item-input">
          <input onBlur={handleFeedback} className="license-item-text" />
        </div>
      ) : (
        <div className="license-header-items">{data.feedback}</div>
      )}
      <div className="license-header-btns">
        {!isEmployee ? (
          <>
            <button
              onClick={handleSucces}
              className="license-btn-action"
              disabled={data.status !== 'PROCESS'}
            >
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
