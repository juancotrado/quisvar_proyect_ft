// import { Input } from '../../../components';
import { useContext, useState } from 'react';
import { useListUsers } from '../../../../../../hooks';
import { axiosInstance } from '../../../../../../services/axiosInstance';
import { licenseList } from '../../../../../../types';
import './LicenseListItem.css';
import { formatDate } from '../../../../../../utils';
import ButtonDelete from '../../../../../../components/button/ButtonDelete';
import { Button, DefaultUserImage } from '../../../../../../components';
import { SocketContext } from '../../../../../../context';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../store';
type license = {
  isEmployee: boolean;
  data: licenseList;
  index: number;
  editData?: () => void;
  onSave?: () => void;
};
interface NameParts {
  firstName: string;
  lastName: string;
}
export const LicenseListItem = ({
  isEmployee,
  data,
  index,
  editData,
  onSave,
}: license) => {
  const { users } = useListUsers();

  const socket = useContext(SocketContext);
  const [feedback, setFeedback] = useState('');
  const { id } = useSelector((state: RootState) => state.userSession);
  const userName = users.find(user => data.usersId === user.id);
  const supervisorName = users.find(user => data.supervisorId === user.id);

  const handleFeedback = (e: React.FocusEvent<HTMLInputElement>) => {
    setFeedback(e.target.value);
  };
  const handleChangeStatus = (value: string) => {
    const newLicense = {
      status: value,
      feedback,
      supervisorId: id,
    };
    axiosInstance.patch(`/license/approve/${data.id}`, newLicense).then(() => {
      onSave?.();
      socket.emit('client:action-button');
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
    return value ? res : '---';
  };
  const splitFullName = (fullName: string): NameParts => {
    const words = fullName.trim().split(/\s+/);

    if (words.length === 1) {
      return { firstName: words[0], lastName: '' };
    } else if (words.length === 2) {
      return { firstName: words[0], lastName: words[1] };
    } else {
      const firstName = words.slice(0, words.length - 2).join(' ');
      const lastName = words.slice(words.length - 2).join(' ');
      return { firstName, lastName };
    }
  };

  return (
    <div
      className={`license-item-content ${
        isEmployee ? 'license-employee' : 'license-admin'
      }`}
    >
      <div
        className="license-header-items"
        style={{ justifyContent: 'center' }}
      >
        {index + 1}
      </div>
      {!isEmployee && (
        <div
          className="license-header-items"
          style={{ cursor: 'context-menu' }}
          title={userName?.name}
        >
          {userName?.name}
        </div>
      )}
      <div
        className="license-header-items"
        style={{ justifyContent: 'center' }}
        title={data.supervisorId ? supervisorName?.name : '---'}
      >
        {supervisorName ? (
          <DefaultUserImage
            user={{
              firstName: splitFullName(supervisorName.name).firstName,
              lastName: splitFullName(supervisorName.name).lastName,
              dni: `000000${supervisorName.id}`,
            }}
          />
        ) : (
          '---'
        )}
      </div>
      <div className="license-header-items">
        {data.type === 'SALIDA' ? 'S' : 'L'}
      </div>
      <div
        className="license-header-items"
        style={{ justifyContent: 'center' }}
      >
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
      <div className="license-header-items">
        {getDate(data.checkout as string)}
      </div>
      {!isEmployee && data.status === 'PROCESO' ? (
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
              onClick={() => handleChangeStatus('ACEPTADO')}
              className="license-btn-action"
              disabled={data.status !== 'PROCESO'}
            >
              <img
                src="/svg/check-blue.svg"
                style={{ width: '20px', height: '20px' }}
              />
              Aprobar
            </button>
            <button
              onClick={() => handleChangeStatus('DENEGADO')}
              className="license-btn-action"
              disabled={data.status !== 'PROCESO'}
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
              disabled={data?.status !== 'PROCESO' ?? false}
            />
            <ButtonDelete
              icon="trash"
              className="role-delete-icon"
              onSave={() => {
                onSave;
                socket.emit('client:action-button');
              }}
              url={`/license/${data.id}`}
              disabled={data?.status !== 'PROCESO' ?? false}
              passwordRequired
            />
          </div>
        )}
      </div>
    </div>
  );
};
