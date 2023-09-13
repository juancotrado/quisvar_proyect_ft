import { useNavigate } from 'react-router-dom';
import { SubTask } from '../../../types/types';
import { statusText } from '../../shared/card/cardTaskInformation/constans';
import './levelSubtask.css';
import { isOpenCardRegisteTask$ } from '../../../services/sharingSubject';
import Button from '../../shared/button/Button';
import ButtonDelete from '../../shared/button/ButtonDelete';

interface LevelSutaskProps {
  subtasks: SubTask[];
  levelId: number;
  onSave?: () => void;
}
const LevelSubtask = ({ subtasks, levelId, onSave }: LevelSutaskProps) => {
  const navigate = useNavigate();

  const taskNavigate = (id: number) => {
    navigate(`tarea/${id}`);
  };
  const handleAddTask = () => {
    isOpenCardRegisteTask$.setSubject = { isOpen: true, levelId };
  };
  const handleEditTask = (subtask: SubTask) => {
    isOpenCardRegisteTask$.setSubject = {
      isOpen: true,
      levelId,
      task: subtask,
    };
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
        <div className="levelSubtask-item">
          <div className="levelSubtask-header-title">OPCIONES</div>
        </div>
      </div>
      {subtasks?.map(subtask => (
        <div
          className="levelSubtask-content pointer"
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
          <div className="levelSubtask-item" onClick={e => e.stopPropagation()}>
            <Button
              icon="pencil"
              className="role-btn"
              onClick={() => handleEditTask(subtask)}
            />
            <ButtonDelete
              icon="trash"
              url={`/subtasks/${subtask.id}`}
              className="role-delete-icon"
              onSave={onSave}
            />
          </div>
        </div>
      ))}

      <div className="levelSubtask-add" onClick={handleAddTask}>
        <span className="levelSubtask-plus">+</span> Agregar tarea
      </div>
    </div>
  );
};

export default LevelSubtask;