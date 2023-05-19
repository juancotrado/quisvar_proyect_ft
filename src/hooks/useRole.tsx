import { useEffect, useState } from 'react';

const useRole = () => {
  const [role, setRole] = useState<string | null>(null);
  const [id, setId] = useState<number>(0);
  const [name, setName] = useState<string>('');

  useEffect(() => {
    const userInfo = localStorage.getItem('personalData');
    if (typeof userInfo !== 'string') return;
    const _user = JSON.parse(userInfo);
    setRole(_user.role);
    setId(_user.id);
    setName(_user.name);
  }, []);
  return { role, id, name };
};

export default useRole;
