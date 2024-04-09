import { RoleForm, User } from '../../../../../../types';
import './userinfo.css';
import { useState } from 'react';
import { axiosInstance } from '../../../../../../services/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../../store';
import { getIconDefault, SnackbarUtilities } from '../../../../../../utils';
import { getListUsers } from '../../../../../../store/slices/listUsers.slice';
import { Button } from '../../../../../../components';
import {
  isOpenCardRegisterUser$,
  isOpenViewDocs$,
} from '../../../../../../services/sharingSubject';

interface UserInfoProps {
  user: User;
  index: number;
  onPrint?: () => void;
  roles: RoleForm[];
}
const UserInfo = ({ user, index, onPrint, roles }: UserInfoProps) => {
  const [isOn, setIsOn] = useState(user.status);
  // const [openRole, setOpenRole] = useState(false);
  const { id: userSessionId } = useSelector(
    (state: RootState) => state.userSession
  );
  const { profile } = user;
  const dispatch: AppDispatch = useDispatch();

  const handleViewDocs = () => {
    isOpenViewDocs$.setSubject = { isOpen: true, user };
  };

  // const getUsers = () => {
  //   dispatch(getListUsers());
  // };

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
    axiosInstance.patch(`/attendanceGroup/disabled/${user.id}`, {
      status: !isOn,
    });
  };
  // console.log(handleChangeStatus);
  // const handleChangeRole = async ({
  //   target,
  // }: React.ChangeEvent<HTMLSelectElement>) => {
  //   const idRole = +target.value;
  //   const _dataRole = { role, id: user.id };
  //   setOpenRole(false);
  //   await axiosInstance.patch(`users/${user.id}`, _dataRole).then(getUsers);
  // };
  // const roleLimit = verifyByRole(user.role, userSession.role);

  const editUser = () => {
    isOpenCardRegisterUser$.setSubject = { isOpen: true, user, roles };
  };

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
        {/* {roles && openRole ? (
          <Select
            defaultValue={user.role?.id}
            className="role-options"
            onChange={handleChangeRole}
            name="role"
            itemKey="id"
            textField="name"
            data={roles}
          />
        ) : ( */}
        <span className="role-title">{user.role?.name}</span>
        {/* )} */}
        {/* {roleLimit && ( */}
        {/* <Button
          icon={openRole ? 'close' : 'pencil'}
          className="role-btn"
          type="button"
          onClick={() => {
            setOpenRole(!openRole);
          }}
        /> */}
        {/* )} */}
      </div>
      <div className="col-span job-container">{profile.job.label}</div>
      <div className="col-span phone-container">{profile.phone}</div>
      <div className="col-span">
        {user.id !== userSessionId && (
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
        <Button
          className="role-btn"
          icon="folder-icon"
          onClick={handleViewDocs}
        />
      </div>
      <div className="col-span actions-container">
        {/* {roleLimit && ( */}
        <>
          <Button icon="pencil" className="role-btn-big" onClick={editUser} />
          {/* <ButtonDelete
              icon="trash"
              disabled={user.id === userSession.id}
              url={`/users/${user.id}`}
              className="role-delete-icon"
              onSave={getUsers}
              passwordRequired
            /> */}
        </>
        {/* )} */}
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
