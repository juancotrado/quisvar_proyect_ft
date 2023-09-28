import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { UserRoleType } from '../types/types';

const useListUsers = (roleType: UserRoleType[] | null = null) => {
  const { listUsers } = useSelector((state: RootState) => state);
  console.log('entre', roleType);
  const users = useMemo(() => {
    console.log('entre al use memo');
    listUsers
      ? listUsers
          .filter(user => (roleType ? roleType.includes(user.role) : user))
          .map(({ profile, ...props }) => ({
            name: `${profile.firstName} ${profile.lastName}`,
            degree: profile.degree,
            position: profile.description,
            ...props,
          }))
      : [];
  }, [roleType]);
  console.log({ users });
  return { users };
};
export default useListUsers;
