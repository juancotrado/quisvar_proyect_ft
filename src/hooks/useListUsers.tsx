import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { User, UserRoleType } from '../types/types';

const useListUsers = (roleType: UserRoleType[] | null = null) => {
  const { listUsers } = useSelector((state: RootState) => state);
  const users =
    (listUsers &&
      listUsers
        .filter(user => (roleType ? roleType.includes(user.role) : user))
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
