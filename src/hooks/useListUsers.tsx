import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { User, UserRoleType } from '../types/types';

const useListUsers = (
  roleType: UserRoleType[] | null = null,
  onlyActive: boolean = true,
  usersData: User[] | null = null
) => {
  const { listUsers } = useSelector((state: RootState) => state);
  const usersList = usersData ?? listUsers;
  const users =
    (usersList &&
      usersList
        .filter(user => (roleType ? roleType.includes(user.role) : user))
        .filter(user => (onlyActive ? user.status : user))
        .map(({ profile, ...props }) => ({
          name: `${profile.firstName} ${profile.lastName}`,
          degree: profile.degree,
          position: profile.description,
          ...props,
        }))) ||
    [];
  return { users };
};
export default useListUsers;
