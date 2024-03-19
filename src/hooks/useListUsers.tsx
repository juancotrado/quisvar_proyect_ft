import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { MenuAccess, MenuRole, User } from '../types/types';
import { useRole } from '.';

const useListUsers = (
  roleType: MenuRole | null = null,
  menu?: MenuAccess | null,
  subMenu?: string,
  onlyActive: boolean | 'all' = true,
  usersData: User[] | null = null
) => {
  const listUsers = useSelector((state: RootState) => state.listUsers);
  if (roleType) {
  }

  const filterRole = (user: User) => {
    if (roleType) {
      const { hasAccess } = useRole(roleType, menu, subMenu, user.role);
      return hasAccess;
    } else {
      return user;
    }
  };
  const usersList = usersData ?? listUsers;
  const users =
    (usersList &&
      usersList
        .filter(filterRole)
        .filter(user => (onlyActive !== 'all' ? user.status : user))
        .map(({ profile, ...props }) => ({
          name: `${profile.firstName} ${profile.lastName}`,
          degree: profile.degree,
          position: profile.description,
          job: profile.job,
          ...props,
        }))) ||
    [];
  return { users };
};
export default useListUsers;
