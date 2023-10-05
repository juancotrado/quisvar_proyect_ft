import { User } from '../../types/types';
import Button from '../shared/button/Button';
import ButtonDelete from '../shared/button/ButtonDelete';
import './UserDetail.css';
interface UserDetailProps {
  user: User;
  index: number;
  onClick?: () => void;
}
const UserDetail = ({ user, index, onClick }: UserDetailProps) => {
  return (
    <tr>
      <h1>asdsad</h1>
      <td>{index + 1}</td>
      <td className="user-info">
        <figure className="user-profile-figure">
          <img src={`https://robohash.org/${user.id}`} alt={user.email} />
        </figure>
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
