import { createContext, useEffect, useState } from 'react';
import { SubTask, User } from '../../../../../../types';
import './taskCard.css';
import { TaskPermission, TaskRole, taskRolePermissions } from '../../models';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../store';

interface TaskContextProps {
  task: SubTask;
  hasPermission: (permission: TaskPermission) => boolean;
  handleViewHistory: () => void;
}

interface ArgsChildren {
  hasPermission: (permission: TaskPermission) => boolean;
  userInCharge: User | undefined;
  modInCharge: User | undefined;
  viewHistory: boolean;
}

export const TaskContext = createContext({} as TaskContextProps);

export interface TaskCardProps {
  task: SubTask;
  children: (args: ArgsChildren) => JSX.Element;
  className?: string;
  style?: React.CSSProperties;
}

const TaskCard = ({ task, children, className, style }: TaskCardProps) => {
  const [userPermission, setUserPermission] = useState<null | TaskRole[]>(null);
  const [viewHistory, setViewHistory] = useState(false);
  const userSession = useSelector((state: RootState) => state.userSession);

  const handleViewHistory = () => setViewHistory(!viewHistory);

  const hasPermission = (permission: TaskPermission): boolean => {
    if (!userPermission) return false;
    const hasPermision = userPermission.some(role =>
      taskRolePermissions[role]?.[task.status]?.includes(permission)
    );
    return hasPermision;
  };
  useEffect(() => {
    if (userSession.id === 9) return setUserPermission([TaskRole.EVALUADOR]);
    setUserPermission([TaskRole.TECNICO]);
  }, []);

  const userInCharge = task.users?.ACTIVE?.[0]?.user;
  const modInCharge = task.mods[0];
  return (
    <TaskContext.Provider
      value={{
        task,
        hasPermission,
        handleViewHistory,
      }}
    >
      <div className={`cardTask ${className}`} style={style}>
        {children({ hasPermission, userInCharge, modInCharge, viewHistory })}
      </div>
    </TaskContext.Provider>
  );
};

export default TaskCard;
