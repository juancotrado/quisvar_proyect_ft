import { useNavigate, useParams } from 'react-router-dom';
import './taks.css';
import { useContext, useEffect, useState } from 'react';
import { axiosInstance } from '../../../../../../services/axiosInstance';
import { SocketContext } from '../../../../../../context';
import { LoaderForComponent } from '../../../../../../components';
import { SubTask } from '../../../../../../types';

export const TaskBasics = () => {
  const [task, setTask] = useState<SubTask | null>(null);
  const socket = useContext(SocketContext);

  const { taskId, stageId, projectId } = useParams();

  useEffect(() => {
    getTask();
  }, [taskId]);

  useEffect(() => {
    socket.on('server:update-subTask', (newSubTask: SubTask) => {
      setTask(newSubTask);
    });
    return () => {
      socket.off('server:update-subTask');
    };
  }, [socket]);

  const getTask = () => {
    axiosInstance
      .get(`/basictasks/${taskId}`, { headers: { noLoader: true } })
      .then(res => {
        setTask(res.data);
        socket.emit('join', `task-${taskId}`);
      });
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
  //const { status } = task;
  return (
    <div className="task">
      <figure className="close-add-card" onClick={goBack}>
        <img src="/svg/close.svg" alt="pencil" />
      </figure>
      <div className="task-header">
        <h4 className="task-header-title">
          Título de la tarea:
          <span className="task-header-title-span">
            {task.item} {task.name}
          </span>
        </h4>
      </div>
      {/* {status === 'UNRESOLVED' && <CardSubtaskHold subTask={task} />}
      {(status === 'PROCESS' ||
        status === 'INREVIEW' ||
        status === 'DENIED') && <CardSubtaskProcess subTask={task} />}
      {(status === 'DONE' || status === 'LIQUIDATION') && (
        <CardSubtaskDone subTask={task} />
      )} */}
    </div>
  );
};
