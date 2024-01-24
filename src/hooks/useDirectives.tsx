import { useState } from 'react';
import { GeneralFile } from '../types';
import { axiosInstance } from '../services/axiosInstance';

const useDirectives = () => {
  const [generalFiles, setGeneralFiles] = useState<GeneralFile[] | null>(null);
  const getGeneralFiles = async () => {
    await axiosInstance.get('/files/generalFiles').then(res => {
      setGeneralFiles(res.data);
    });
  };

  return { generalFiles, getGeneralFiles };
};

export default useDirectives;
