import { useNavigate, useParams } from 'react-router-dom';
import './taks.css';
import { useContext, useEffect, useState } from 'react';
import { SubTask } from '../../types/types';
import { axiosInstance } from '../../services/axiosInstance';
import {
  CardSubtaskDone,
  CardSubtaskHold,
  CardSubtaskProcess,
} from '../../components';
import { SocketContext } from '../../context/SocketContex';
const Task = () => {
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
    axiosInstance.get(`/subtasks/${taskId}`).then(res => {
      setTask(res.data);
      socket.emit('join', `task-${res.data.id}`);
    });
  };

  const navigate = useNavigate();
  const goBack = () => {
    navigate(`/especialidades/proyecto/${projectId}/etapa/${stageId}`);
  };
  if (!task) return <></>;
  const { status } = task;
  return (
    <div className="task">
      <span className="close-add-card" onClick={goBack}>
        <img src="/svg/close.svg" alt="pencil" />
      </span>
      <div className="task-header">
        <h4 className="task-header-title">
          Título de la tarea:
          <span className="task-header-title-span">
            {task.item}. {task.name}
          </span>
        </h4>
      </div>
      {status === 'UNRESOLVED' && <CardSubtaskHold subTask={task} />}
      {(status === 'PROCESS' ||
        status === 'INREVIEW' ||
        status === 'DENIED') && <CardSubtaskProcess subTask={task} />}
      {(status === 'DONE' || status === 'LIQUIDATION') && (
        <CardSubtaskDone subTask={task} />
      )}
    </div>
  );
};

export default Task;
