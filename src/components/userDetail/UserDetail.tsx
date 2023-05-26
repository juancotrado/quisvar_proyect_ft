import { Users } from '../../types/types';
import Button from '../shared/button/Button';
import ButtonDelete from '../shared/button/ButtonDelete';
import './UserDetail.css';
interface UserDetailProps {
  user: Users;
  index: number;
  onClick?: () => void;
}
const UserDetail = ({ user, index, onClick }: UserDetailProps) => {
  return (
    <tr>
      <td>{index + 1}</td>
      <td className="user-info">
        <img src="/svg/Profile Avatar.svg" alt="" className="icon" />
        <div className="name-container">
          <h1 className="list-name">
            {user.profile?.firstName + ' ' + user.profile?.lastName}
          </h1>
          <span>{user.email}</span>
        </div>
      </td>
      <td>{user.role}</td>
      <td
        className={`list-status ${
          user.status ? 'user-active' : 'user-inactive'
        }`}
      >
        {user.status ? 'Activo' : 'Inactivo'}
      </td>
      <td>{user.profile?.dni}</td>
      <td>{user.profile?.phone}</td>
      <td>
        <div className="edit-btn">
          <Button
            icon="pencil"
            className="project-edit-icon"
            onClick={onClick}
          />
          <ButtonDelete
            icon="trash"
            url={`/users/${user.id}`}
            className="project-delete-icon"
          />
        </div>
      </td>
    </tr>
  );
};

export default UserDetail;
