import { useEffect, useRef } from 'react';
import { URL, axiosInstance } from '../services/axiosInstance';
type TypeArchiver = 'projects' | 'tasks' | 'indextasks' | 'tasks2' | 'tasks3';
const useArchiver = (id: number, type: TypeArchiver) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  const handleArchiver = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    axiosInstance.get(`/archiver/${id}?type=${type}`).then(res => {
      const normalizePath = res.data.url.replace('./uploads', 'static');
      window.location.href = `${URL}/${normalizePath}`;
      timeoutRef.current = setTimeout(() => {
        axiosInstance.delete(`/archiver/?path=${res.data.url}`).then(res => {
          console.log(res.data);
        });
      }, 3000);
    });
  };
  return { handleArchiver };
};

export default useArchiver;
