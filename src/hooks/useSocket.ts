import { useMemo } from 'react';
import io from 'socket.io-client';
import { URL } from '../services/axiosInstance';

const useSocket = () => {
  const socket = useMemo(() => io(URL), []);

  return socket;
};
export default useSocket;
