import { createContext } from 'react';
import useSocket from '../hooks/useSocket';
import { Socket } from 'socket.io-client';

export const SocketContext = createContext<Socket>({} as Socket);

interface SocketProviderProps {
  children: JSX.Element | JSX.Element[];
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const socket = useSocket();

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
