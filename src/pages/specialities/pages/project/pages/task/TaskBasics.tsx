import { useNavigate, useParams } from 'react-router-dom';
import './task.css';
import { useContext, useEffect, useState } from 'react';
import { axiosInstance } from '../../../../../../services/axiosInstance';
import { SocketContext } from '../../../../../../context';
import { IconAction, LoaderForComponent } from '../../../../../../components';
import { SubTask } from '../../../../../../types';
import { CardSubtaskHoldGeneral } from './View';

export const TaskBasics = () => {
  const [task, setTask] = useState<SubTask | null>(null);
  const socket = useContext(SocketContext);

  const { taskId, stageId, projectId } = useParams();

  useEffect(() => {
    getTask();
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

  const navigate = useNavigate();
  const goBack = () => {
    navigate(
      `/especialidades/proyecto/${projectId}/etapa/${stageId}/presupuestos`
    );
  };
  if (!task)
    return (
      <div className="task-loader">
        <LoaderForComponent />
      </div>
    );
  const { status } = task;
  return (
    <div className="task">
      <IconAction icon="close" onClick={goBack} size={0.8} top={0} />

      {status === 'UNRESOLVED' && <CardSubtaskHoldGeneral task={task} />}
      {/* {(status === 'PROCESS' ||
        status === 'INREVIEW' ||
        status === 'DENIED') && <CardSubtaskProcess subTask={task} />}
      {(status === 'DONE' || status === 'LIQUIDATION') && (
        <CardSubtaskDone subTask={task} />
      )} */}
    </div>
  );
};
