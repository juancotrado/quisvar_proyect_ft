import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { UserRoleType } from '../types/types';

const useListUsers = (roleType: UserRoleType[] | null = null) => {
  const { listUsers } = useSelector((state: RootState) => state);
  const users = useMemo(
    () =>
      listUsers
        ? listUsers
            .filter(user => (roleType ? roleType.includes(user.role) : user))
            .map(({ profile, ...props }) => ({
              name: `${profile.firstName} ${profile.lastName}`,
              degree: profile.degree,
              position: profile.description,
              ...props,
            }))
        : [],
    [listUsers, roleType]
  );

  return { users };
};
export default useListUsers;
