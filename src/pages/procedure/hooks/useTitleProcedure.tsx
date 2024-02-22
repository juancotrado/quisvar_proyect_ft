import { useEffect, useState } from 'react';
import { YEAR } from '../models';
import { axiosInstance } from '../../../services/axiosInstance';
import { quantityType } from '../../../types';
import { HashFile } from '../../../utils';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

const useTitleProcedure = (url: string) => {
  const [countMessage, setCountMessage] = useState<quantityType[] | null>(null);
  const { lastName, firstName } = useSelector(
    (state: RootState) => state.userSession.profile
  );

  useEffect(() => {
    getQuantityServices();
  }, []);

  const handleTitle = (value: string) => {
    const HashUser = HashFile(`${firstName} ${lastName}`);
    const countFile = countMessage?.find(file => file.type === value);
    const newIndex = (countFile ? countFile._count.type : 0) + 1;
    return `${value} N°${newIndex} DHYRIUM-${HashUser}-${YEAR}`;
  };
  const getQuantityServices = () =>
    axiosInstance.get(url).then(res => setCountMessage(res.data));

  return { handleTitle };
};

export default useTitleProcedure;
