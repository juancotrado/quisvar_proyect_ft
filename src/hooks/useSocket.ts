import { useMemo } from 'react';
import io from 'socket.io-client';

const useSocket = () => {
  const socket = useMemo(() => io('http://localhost:8081'), []);

  return socket;
};
export default useSocket;
