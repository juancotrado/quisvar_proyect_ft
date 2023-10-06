// import { Input } from '../../../components';
import { useState } from 'react';
import Button from '../../../components/shared/button/Button';
import ButtonDelete from '../../../components/shared/button/ButtonDelete';
import useListUsers from '../../../hooks/useListUsers';
import { axiosInstance } from '../../../services/axiosInstance';
import { licenseList } from '../../../types/types';
import './LicenseListItem.css';
import formatDate from '../../../utils/formatDate';
type license = {
  isEmployee: boolean;
  data: licenseList;
  index: number;
  editData?: () => void;
  onSave?: () => void;
};

const LicenseListItem = ({
  isEmployee,
  data,
  index,
  editData,
  onSave,
}: license) => {
  const { users } = useListUsers();
  const [feedback, setFeedback] = useState('');
  const userName = users.find(user => data.usersId === user.id);
  const handleFeedback = (e: React.FocusEvent<HTMLInputElement>) => {
    setFeedback(e.target.value);
  };
  const handleChangeStatus = (value: string) => {
    const newLicense = {
      status: value,
      feedback,
    };
    axiosInstance.patch(`/license/${data.id}`, newLicense).then(res => {
      console.log(res.data);
      onSave?.();
    });
  };
  const getDate = (value: string) => {
    const GMT = 5 * 60 * 60 * 1000;
    const time = new Date(value);
    const gmtMinus5Time = new Date(time.getTime() + GMT);
    const res = formatDate(gmtMinus5Time, {
      day: '2-digit',
      weekday: 'short',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
    return res;
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
      <div className="license-header-items">
        {formatDate(new Date(data.createdAt))}
      </div>
      <div className="license-header-items">{data.reason}</div>
      {/* <div className="license-header-items">{data.status}</div> */}
      <div className="license-header-items">
        <span className={`card-status-message license-${data.status}`}>
          {data.status.toLowerCase()}
        </span>
      </div>
      <div className="license-header-items">{getDate(data.startDate)}</div>
      <div className="license-header-items">{getDate(data.untilDate)}</div>
      {!isEmployee && data.status === 'PROCESS' ? (
        <div className="license-item-input">
          <input onBlur={handleFeedback} className="license-item-text" />
        </div>
      ) : (
        <div className="license-item-input">{data.feedback}</div>
      )}
      <div className="license-header-btns">
        {!isEmployee ? (
          <>
            <button
              onClick={() => handleChangeStatus('ACTIVE')}
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
              onClick={() => handleChangeStatus('DENIED')}
              className="license-btn-action"
              disabled={data.status !== 'PROCESS'}
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
              onClick={editData}
              disabled={
                data && (data.status === 'ACTIVE' || data.status === 'INACTIVE')
              }
            />
            <ButtonDelete
              icon="trash"
              className="role-delete-icon"
              onSave={onSave}
              passwordRequired
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LicenseListItem;
