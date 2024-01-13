import { User } from '../../types/types';
import Button from '../button/Button';
import './userinfo.css';
import { useState } from 'react';
import SelectOptions from '../select/Select';
import { axiosInstance } from '../../services/axiosInstance';
import { getListByRole, verifyByRole } from '../../utils/roles';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { getIconDefault, getRole } from '../../utils/tools';
import { SnackbarUtilities } from '../../utils/SnackbarManager';
import { getListUsers } from '../../store/slices/listUsers.slice';

interface UserInfoProps {
  user: User;
  index: number;
  onUpdate?: () => void;
  onPrint?: () => void;
  onViewDocs?: () => void;
}
const UserInfo = ({
  user,
  index,
  onUpdate,
  onPrint,
  onViewDocs,
}: UserInfoProps) => {
  const [isOn, setIsOn] = useState(user.status);
  const [openRole, setOpenRole] = useState(false);
  const { userSession } = useSelector((state: RootState) => state);
  const { profile } = user;
  const dispatch: AppDispatch = useDispatch();

  const getUsers = () => {
    dispatch(getListUsers());
  };

  const sendInfo = () => {
    const { firstName, lastName } = user.profile;
    SnackbarUtilities.info(
      `Usuario ${firstName} ${lastName} ${isOn ? 'archivado' : 'activado'}`
    );
  };
  const handleChangeStatus = () => {
    const _data = { status: !isOn, id: user.id };
    axiosInstance.patch(`users/${user.id}`, _data).then(() => {
      setIsOn(!isOn);
      dispatch(getListUsers()).then(sendInfo);
    });
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
    <div className="user-container header-grid-row">
      <div className="col-span  email-container ">
        <span className="user-index">{index + 1}</span>
        <figure className="user-profile-figure">
          <img src={getIconDefault(user.profile.dni)} alt={user.email} />
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
          <span className="role-title">{getRole(user.role)}</span>
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
      <div className="col-span job-container">{profile.job}</div>
      <div className="col-span phone-container">{profile.phone}</div>
      <div className="col-span">
        {user.id !== userSession.id && (
          <div
            className="switch-status"
            data-ison={isOn}
            onClick={handleChangeStatus}
          >
            <div className={`handle-statuts ${isOn && 'handle-on'}`}></div>
          </div>
        )}
      </div>
      <div className="col-span">
        <Button className="role-btn" icon="folder-icon" onClick={onViewDocs} />
      </div>
      <div className="col-span actions-container">
        {roleLimit && (
          <>
            <Button icon="pencil" className="role-btn-big" onClick={onUpdate} />
            {/* <ButtonDelete
              icon="trash"
              disabled={user.id === userSession.id}
              url={`/users/${user.id}`}
              className="role-delete-icon"
              onSave={getUsers}
              passwordRequired
            /> */}
          </>
        )}
      </div>
      <div className="col-span">
        <Button
          className="role-btn-big"
          icon="print-report"
          onClick={onPrint}
        />
      </div>
    </div>
  );
};

export default UserInfo;
