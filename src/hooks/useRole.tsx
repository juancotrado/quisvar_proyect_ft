import { useEffect, useState } from 'react';

const useRole = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const userInfo = localStorage.getItem('personalData');
    if (typeof userInfo !== 'string') return;
    const _user = JSON.parse(userInfo);
    setRole(_user.role);
  }, []);
  return { role };
};

export default useRole;
