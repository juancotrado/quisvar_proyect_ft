import { Input } from '../..';
import { DataUser } from '../../../types/types';
import './subtaskUsers.css';
import { FocusEvent } from 'react';

interface SubtaskUsersProps {
  usersData: DataUser[];
  handleRemoveUser?: (data: DataUser) => void;
  handlePorcentage?: (e: FocusEvent<HTMLInputElement>) => void;
  areAuthorizedUsers?: boolean;
  viewProcentage?: boolean;
}
const SubtaskUsers = ({
  usersData,
  handleRemoveUser,
  handlePorcentage,
  areAuthorizedUsers = false,
  viewProcentage = false,
}: SubtaskUsersProps) => {
  return (
    <div className="subtaskUsers-users-contain">
      <h4 className="subtaskUsers-title-information">
        <figure className="subtaskUsers-figure">
          <img src="/svg/user-task.svg" alt="W3Schools" />
        </figure>
        Lista de Usuarios Asignados:
      </h4>
      {usersData.map(_user => (
        <div key={_user.id} className="subtaskUsers-list-user">
          <h5 className="subtaskUsers-user-info">
            <figure className="subtaskUsers-figure">
              <img src="/svg/person-add.svg" alt="W3Schools" />
            </figure>
            {_user.name}
          </h5>
          {handleRemoveUser && (
            <button type="button" onClick={() => handleRemoveUser(_user)}>
              <img src="/svg/close.svg" className="subtaskUsers-user-delete" />
            </button>
          )}
          {handlePorcentage && (
            <div className="subtaskUsers-porcentage-input">
              <Input
                onBlur={handlePorcentage}
                placeholder={String(_user.percentage)}
                name={String(_user.id)}
                className="subtaskUsers-percentage-value"
                disabled={!areAuthorizedUsers}
              />
              %
            </div>
          )}
          {viewProcentage && (
            <div className="subtaskUsers-porcentage-input">
              <Input
                placeholder={String(_user.percentage)}
                name={String(_user.id)}
                className="subtaskUsers-percentage-value"
                disabled={true}
              />
              %
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SubtaskUsers;
