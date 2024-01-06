import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { UserRoleType } from '../types/types';

const useListUsers = (
  roleType: UserRoleType[] | null = null,
  onlyActive: boolean = true
) => {
  const { listUsers } = useSelector((state: RootState) => state);
  const users =
    (listUsers &&
      listUsers
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
