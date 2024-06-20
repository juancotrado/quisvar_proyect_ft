import { createContext, useEffect, useState } from 'react';
import { SubTask } from '../../../../../../types';
import './taskCard.css';
import { TaskPermission, TaskRole, taskRolePermissions } from '../../models';

interface TaskContextProps {
  task: SubTask;
  hasPermission: (permission: TaskPermission) => boolean;
}

interface ArgsChildren {
  hasPermission: (permission: TaskPermission) => boolean;
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
  const hasPermission = (permission: TaskPermission): boolean => {
    if (!userPermission) return false;
    const hasPermision = userPermission.some(role =>
      taskRolePermissions[role]?.['PROCESS']?.includes(permission)
    );
    return hasPermision;
  };
  useEffect(() => {
    setUserPermission([TaskRole.TECNICO]);
  }, []);

  return (
    <TaskContext.Provider
      value={{
        task,
        hasPermission,
      }}
    >
      <div className={`cardTask ${className}`} style={style}>
        {children({ hasPermission })}
      </div>
    </TaskContext.Provider>
  );
};

export default TaskCard;
