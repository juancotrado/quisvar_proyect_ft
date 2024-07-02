import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './task.css';
import { useContext, useEffect, useState } from 'react';
import { axiosInstance } from '../../../../../../services/axiosInstance';
import { SocketContext } from '../../../../../../context';
import { IconAction, LoaderForComponent } from '../../../../../../components';
import { SubTask } from '../../../../../../types';
import { CardSubtaskHoldGeneral } from './View';

export const TaskBasics = () => {
  const socket = useContext(SocketContext);
  const { taskId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [task, setTask] = useState<SubTask | null>(null);

  useEffect(() => {
    getTask();
    return () => {
      setTask(null);
    };
  }, [taskId]);

  useEffect(() => {
    socket.on('server:load-basic-task', (task: SubTask) => {
      setTask(task);
    });
    return () => {
      socket.off('server:load-basic-task');
    };
  }, [socket]);

  const getTask = async () => {
    const res = await axiosInstance.get<SubTask>(`/basictasks/${taskId}`, {
      headers: { noLoader: true },
    });
    setTask(res.data);
    socket.emit('join', `basic-task-${taskId}`);
  };

  const goBack = () => {
    const currentPath = location.pathname;
    const newPath = currentPath.replace(/\/tarea\/\d+$/, '');
    navigate(newPath);
  };
  if (!task)
    return (
      <div className="task-loader">
        <LoaderForComponent />
      </div>
    );
  return (
    <div className="task">
      <IconAction icon="close" onClick={goBack} size={0.8} top={0} />
      {<CardSubtaskHoldGeneral task={task} />}
    </div>
  );
};
