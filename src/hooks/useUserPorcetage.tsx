import { useMemo } from 'react';
import { Users } from '../types/types';

const useUserPorcetage = (users: Users[]) => {
  const usersData = useMemo(
    () =>
      users.map(user => ({
        id: user.user.id,
        name: `${user.user.profile.firstName} ${user.user.profile.lastName}`,
        percentage: user.percentage,
      })),
    [users]
  );

  return { usersData };
};
export default useUserPorcetage;
