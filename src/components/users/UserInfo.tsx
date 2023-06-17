import { motion } from 'framer-motion';
import { User } from '../../types/types';
import Button from '../shared/button/Button';
import ButtonDelete from '../shared/button/ButtonDelete';
import './userinfo.css';
import { useState } from 'react';
import SelectOptions from '../shared/select/Select';
import { axiosInstance } from '../../services/axiosInstance';
import { spring } from '../../animations/animations';

const roleList = [
  { id: 'EMPLOYEE', value: 'EMPLEADO' },
  { id: 'MOD', value: 'COORDINADOR' },
  { id: 'ADMIN', value: 'ADMINISTRADOR' },
];

interface UserInfoProps {
  user: User;
  onUpdate?: () => void;
  onUpdateStatus?: () => void;
  onDelete?: () => void;
}
const UserInfo = ({
  user,
  onUpdate,
  onUpdateStatus,
  onDelete,
}: UserInfoProps) => {
  const [isOn, setIsOn] = useState(user.status);
  const [openRole, setOpenRole] = useState(false);
  const { profile } = user;

  const toggleSwitch = () => {
    setIsOn(!isOn);
  };

  const handleChangeStatus = async () => {
    const _data = { status: !isOn, id: user.id };
    await axiosInstance.patch(`users/${user.id}`, _data).then(onUpdateStatus);
  };

  const handleChangeRole = async ({
    target,
  }: React.ChangeEvent<HTMLSelectElement>) => {
    const role = target.value;
    const _dataRole = { role, id: user.id };
    setOpenRole(false);
    await axiosInstance
      .patch(`users/${user.id}`, _dataRole)
      .then(onUpdateStatus);
  };

  return (
    <div className="user-container">
      <div className="col-span col-span-2 email-container">
        <img src="/svg/profile_avatar.svg" alt={user.email} className="icon" />
        <div className="user-details">
          <h4>{user.email} </h4>
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
            data={roleList}
          />
        ) : (
          <span>{roleList.find(e => e.id === user.role)?.value}</span>
        )}
        <Button
          icon="pencil"
          className="role-btn"
          type="button"
          onClick={() => {
            setOpenRole(!openRole);
          }}
        />
      </div>
      <div className="col-span">
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
      </div>
      <div className="col-span phone-container">{profile.dni}</div>
      <div className="col-span phone-container">{profile.phone}</div>
      <div className="col-span actions-container">
        <Button icon="pencil" className="role-btn" onClick={onUpdate} />
        <ButtonDelete
          icon="trash"
          url={`/users/${user.id}`}
          className="project-delete-icon"
          onSave={onDelete}
        />
      </div>
    </div>
  );
};

export default UserInfo;
