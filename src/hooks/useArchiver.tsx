import { useEffect, useRef } from 'react';
import { URL, axiosInstance } from '../services/axiosInstance';
type TypeArchiver = 'projects' | 'levels' | 'stages';
type TypeZip = 'projects' | 'editables' | 'pdfs';
const useArchiver = (
  id: number,
  type: TypeArchiver,
  nameZip: string,
  typeZip: TypeZip = 'projects'
) => {
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
    axiosInstance
      .get(`/archiver/${id}?type=${type}&nameZip=${nameZip}&typeZip=${typeZip}`)
      .then(res => {
        const deleteUpload = res.data.url.replace('./uploads/', '');
        const posSlash = deleteUpload.indexOf('/');
        const normalizePath = deleteUpload.slice(
          -(deleteUpload.length - posSlash)
        );

        window.location.href = `${URL}/projects${normalizePath}`;
        timeoutRef.current = setTimeout(() => {
          axiosInstance.delete(`/archiver/?path=${res.data.url}`);
        }, 3000);
      });
  };
  return { handleArchiver };
};

export default useArchiver;
