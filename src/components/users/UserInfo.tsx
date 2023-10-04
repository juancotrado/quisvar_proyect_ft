import { User } from '../../types/types';
import Button from '../shared/button/Button';
import ButtonDelete from '../shared/button/ButtonDelete';
import './userinfo.css';
import { useState } from 'react';
import SelectOptions from '../shared/select/Select';
import { axiosInstance } from '../../services/axiosInstance';
import { getListByRole, verifyByRole } from '../../utils/roles';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface UserInfoProps {
  user: User;
  onUpdate?: () => void;
  getUsers?: () => void;
  onPrint?: () => void;
  onViewDocs?: () => void;
}
const UserInfo = ({
  user,
  onUpdate,
  getUsers,
  onPrint,
  onViewDocs,
}: UserInfoProps) => {
  const [isOn, setIsOn] = useState(user.status);
  const [openRole, setOpenRole] = useState(false);
  const { userSession } = useSelector((state: RootState) => state);
  const { profile } = user;
  const toggleSwitch = () => {
    setIsOn(!isOn);
  };

  const handleChangeStatus = async () => {
    const _data = { status: !isOn, id: user.id };
    await axiosInstance.patch(`users/${user.id}`, _data).then(getUsers);
  };

  const handleChangeRole = async ({
    target,
  }: React.ChangeEvent<HTMLSelectElement>) => {
    const role = target.value;
    const _dataRole = { role, id: user.id };
    setOpenRole(false);
    await axiosInstance.patch(`users/${user.id}`, _dataRole).then(getUsers);
  };
  const roleLimit = verifyByRole(user.role, userSession.role);

  return (
    <div className="user-container">
      <div className="col-span col-span-2 email-container">
        <figure className="user-profile-figure">
          <img
            src={`https://robohash.org/${user.profile.dni}`}
            alt={user.email}
          />
        </figure>

        <div className="user-details">
          <h4>{profile.dni} </h4>
          <p>
            {profile.lastName} {profile.firstName}
          </p>
        </div>
      </div>
      <div className="col-span role-container">
        {openRole ? (
          <SelectOptions
            defaultValue={user.role}
            className="role-options"
            onChange={handleChangeRole}
            name="role"
            itemKey="id"
            textField="value"
            data={getListByRole(userSession.role)}
          />
        ) : (
          <span className="role-title">
            {getListByRole('SUPER_ADMIN').find(e => e.id === user.role)?.value}
          </span>
        )}
        {roleLimit && (
          <Button
            icon={openRole ? 'close' : 'pencil'}
            className="role-btn"
            type="button"
            onClick={() => {
              setOpenRole(!openRole);
            }}
          />
        )}
      </div>
      <div className="col-span">
        {user.id !== userSession.id && (
          <div
            className="switch-status"
            data-ison={isOn}
            onClick={() => {
              toggleSwitch();
              handleChangeStatus();
            }}
          >
            <div className={`handle-statuts ${isOn && 'handle-on'}`}></div>
          </div>
        )}
      </div>
      <div className="col-span phone-container">{profile.description}</div>
      <div className="col-span phone-container">{profile.phone}</div>
      <div className="col-span">
        <Button className="role-btn" icon="folder-icon" onClick={onViewDocs} />
      </div>
      {roleLimit && (
        <div className="col-span actions-container">
          <Button icon="pencil" className="role-btn" onClick={onUpdate} />
          <ButtonDelete
            icon="trash"
            disabled={user.id === userSession.id}
            url={`/users/${user.id}`}
            className="role-delete-icon"
            onSave={getUsers}
            passwordRequired
          />
        </div>
      )}
      <div className="col-span">
        <Button className="role-btn" icon="print-report" onClick={onPrint} />
      </div>
    </div>
  );
};

export default UserInfo;
