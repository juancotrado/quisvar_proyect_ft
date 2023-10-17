import { ListUsers } from '../../../../types/types';
import DefaultUserImage from '../../../shared/defaultUserImage/DefaultUserImage';
import './moreInfoUsers.css';
interface MoreInfoUsersProps {
  users: ListUsers[];
}
const MoreInfoUsers = ({ users }: MoreInfoUsersProps) => {
  return (
    <div className="moreInfoUsers-datails-contain moreInfoUsers-datails-absolute">
      {users.map(user => (
        <div className="moreInfoUsers-users-contain">
          <DefaultUserImage user={user} />
          <span className="moreInfoUsers-count">x{user.count}</span>
        </div>
      ))}
      {users.length === 0 && (
        <span className="moreInfoUsers-info">Aun no hay usuarios Asignado</span>
      )}
    </div>
  );
};

export default MoreInfoUsers;
