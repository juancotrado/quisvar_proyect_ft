import { useNavigate, useParams } from 'react-router-dom';
import './taks.css';
import { useEffect, useState } from 'react';
import { SubTask } from '../../types/types';
import { axiosInstance } from '../../services/axiosInstance';
import { CardSubtaskDone, CardSubtaskHold } from '../../components';
const Task = () => {
  const [task, setTask] = useState<SubTask | null>(null);

  const { taskId, id, stageId } = useParams();

  useEffect(() => {
    getTask();
  }, [taskId]);

  const getTask = () => {
    axiosInstance.get(`/subtasks/${taskId}`).then(res => {
      setTask(res.data);
    });
  };

  const navigate = useNavigate();
  const goBack = () => {
    navigate(`/especialidades/etapa/${stageId}/proyecto/${id}`);
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
            {' '}
            {task.item}. {task.name}
          </span>
        </h4>
      </div>
      {status === 'UNRESOLVED' && <CardSubtaskHold subTask={task} />}
      {/* {(status === 'PROCESS' ||
        status === 'INREVIEW' ||
        status === 'DENIED') && <CardSubtaskProcess subTask={task} />} */}
      {(status === 'DONE' || status === 'LIQUIDATION') && (
        <CardSubtaskDone subTask={task} />
      )}
    </div>
  );
};

export default Task;
