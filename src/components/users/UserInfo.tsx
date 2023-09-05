import { motion } from 'framer-motion';
import { User } from '../../types/types';
import Button from '../shared/button/Button';
import ButtonDelete from '../shared/button/ButtonDelete';
import './userinfo.css';
import { useState } from 'react';
import SelectOptions from '../shared/select/Select';
import { URL, axiosInstance } from '../../services/axiosInstance';
import { spring } from '../../animations/animations';
import { getListByRole, verifyByRole } from '../../utils/roles';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import UploadFile from '../shared/uploadFile/UploadFile';
// import { isOpenModal$ } from '../../services/sharingSubject';
import { isOpenCardGenerateReport$ } from '../../services/sharingSubject';

// const roleList = [
//   { id: 'SUPER_ADMIN', value: 'GERENTE GENERAL' },
//   { id: 'ADMIN', value: 'GERENTE' },
//   { id: 'ASSISTANT', value: 'ASISTENTE DE GENERENCIA' },
//   { id: 'SUPER_MOD', value: 'COORD GENERAL' },
//   { id: 'MOD', value: 'COORDINADOR' },
//   { id: 'EMPLOYEE', value: 'EMPLEADO' },
// ];

interface UserInfoProps {
  user: User;
  onUpdate?: () => void;
  getUsers?: () => void;
}
const UserInfo = ({ user, onUpdate, getUsers }: UserInfoProps) => {
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
  const showModal = () => {
    isOpenCardGenerateReport$.setSubject = true;
  };
  return (
    <div className="user-container">
      <div className="col-span col-span-2 email-container">
        <img src="/svg/profile_avatar.svg" alt={user.email} className="icon" />
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
            <motion.div
              className={`handle-statuts ${isOn && 'handle-on'}`}
              layout
              transition={spring}
            ></motion.div>
          </div>
        )}
      </div>
      <div className="col-span phone-container">{profile.description}</div>
      <div className="col-span phone-container">{profile.phone}</div>
      {!user.cv ? (
        <UploadFile
          text="Subir Archivo"
          onSave={getUsers}
          uploadName="fileUser"
          URL={`/files/uploadFileUser/${user.id}?isContract=false`}
        />
      ) : (
        <div className="col-span">
          <figure className="cardSubtaskProcess-files-icon">
            <a href={`${URL}/file-user/cvs/${user.cv}`} target="_blank">
              <img src="/svg/file-download.svg" alt="W3Schools" />
            </a>
            <div className="cardSubtaskProcess-files-btn">
              <ButtonDelete
                icon="trash-red"
                onSave={getUsers}
                url={`/files/removeFileUser/${user.id}/${user.cv}?isContract=false`}
                className="cardSubtaskProcess-files-btn-delete"
              />
            </div>
          </figure>
        </div>
      )}
      {!user.contract ? (
        <UploadFile
          text="Subir Archivo"
          uploadName="fileUser"
          onSave={getUsers}
          URL={`/files/uploadFileUser/${user.id}?isContract=true`}
        />
      ) : (
        <div className="col-span">
          <figure className="cardSubtaskProcess-files-icon">
            <a
              href={`${URL}/file-user/contracts/${user.contract}`}
              target="_blank"
            >
              <img src="/svg/file-download.svg" alt="W3Schools" />
            </a>
            <div className="cardSubtaskProcess-files-btn">
              <ButtonDelete
                icon="trash-red"
                url={`/files/removeFileUser/${user.id}/${user.contract}?isContract=true`}
                onSave={getUsers}
                className="cardSubtaskProcess-files-btn-delete"
              />
            </div>
          </figure>
        </div>
      )}
      {roleLimit && (
        <div className="col-span actions-container">
          <Button icon="pencil" className="role-btn" onClick={onUpdate} />
          <ButtonDelete
            icon="trash"
            disabled={user.id === userSession.id}
            url={`/users/${user.id}`}
            className="role-delete-icon"
            onSave={getUsers}
          />
        </div>
      )}
      <div className="col-span">
        <Button text="imprimir" onClick={showModal} />
      </div>
    </div>
  );
};

export default UserInfo;
