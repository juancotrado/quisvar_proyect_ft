import { useEffect, useState } from 'react';
import { axiosInstance } from '../services/axiosInstance';
interface AreaType {
  id: number;
  name: string;
}
interface UserType {
  id: number;
  role: string;
  profile: {
    firstName: string;
    lastName: string;
  };
  name: string;
}

const useInfoData = () => {
  const [users, setUsers] = useState<[] | null>(null);
  const [areas, setAreas] = useState<[] | null>(null);

  useEffect(() => {
    getAreas();
    getUsers();
  }, []);

  const getAreas = () => {
    axiosInstance.get('/workareas').then(res => {
      const newProjects = res.data.map(({ id, name }: AreaType) => ({
        id,
        name,
      }));
      setAreas(newProjects);
    });
  };

  const getUsers = () => {
    axiosInstance.get('/users').then(res => {
      const getModeratos = res.data.filter(
        ({ role }: UserType) => role !== 'EMPLOYEE'
      );
      const newModerators = getModeratos.map(({ id, profile }: UserType) => ({
        id,
        name: `${profile.firstName} ${profile.lastName}`,
      }));
      setUsers(newModerators);
    });
  };

  return { users, areas };
};

export default useInfoData;
