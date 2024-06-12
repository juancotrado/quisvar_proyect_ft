import { useMemo } from 'react';
import io from 'socket.io-client';
import { URL } from '../services/axiosInstance';
const token = localStorage.getItem('token') || '';
const useSocket = (spaceName = '') => {
  const socket = useMemo(
    () =>
      io(`${URL}/${spaceName}`, {
        extraHeaders: {
          authorization: `bearer ${token}`,
        },
      }),
    []
  );

  return socket;
};
export default useSocket;
