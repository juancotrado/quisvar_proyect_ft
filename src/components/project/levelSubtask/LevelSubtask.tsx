import { useNavigate } from 'react-router-dom';
import { SubTask } from '../../../types/types';
import { statusText } from '../../shared/card/cardTaskInformation/constans';
import './levelSubtask.css';

interface LevelSutaskProps {
  subtasks: SubTask[];
}
const LevelSubtask = ({ subtasks }: LevelSutaskProps) => {
  const navigate = useNavigate();

  const taskNavigate = (id: number) => {
    navigate(`tarea/${id}`);
  };
  return (
    <div className="levelSubtask">
      <div className="levelSubtask-content levelSubtask-header">
        <div className="levelSubtask-item">
          <div className="levelSubtask-header-title"># ITEM</div>
        </div>
        <div className="levelSubtask-item">
          <div className="levelSubtask-header-title">NOMBRE</div>{' '}
        </div>
        <div className="levelSubtask-item">
          <div className="levelSubtask-header-title">PRECIO</div>
        </div>
        <div className="levelSubtask-item">
          <div className="levelSubtask-header-title">PROCENTAJE</div>
        </div>
        <div className="levelSubtask-item">
          <div className="levelSubtask-header-title">ESTADO</div>
        </div>
        <div className="levelSubtask-item">
          <div className="levelSubtask-header-title">USUARIO ASIGNADO</div>
        </div>
      </div>
      {subtasks?.map(subtask => (
        <div
          className="levelSubtask-content"
          onClick={() => taskNavigate(subtask.id)}
        >
          <div className="levelSubtask-item">
            <div className="levelSubtask-text">{subtask.item}</div>
          </div>
          <div className="levelSubtask-item">
            <div className="levelSubtask-text">{subtask.name}</div>
          </div>
          <div className="levelSubtask-item">
            <div className="levelSubtask-text">S/.{subtask.price}</div>
          </div>
          <div className="levelSubtask-item">
            <div className="levelSubtask-text">{subtask.percentage}%</div>
          </div>
          <div className="levelSubtask-item">
            <div
              className={`levelSubtask-text  levelSubask-status  ${subtask.status}`}
            >
              {statusText[subtask.status]}
            </div>
          </div>
          <div className="levelSubtask-item">
            <div className="levelSubtask-text">
              {subtask.users.length
                ? subtask.users.join(',')
                : 'No Asignado aun'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LevelSubtask;
