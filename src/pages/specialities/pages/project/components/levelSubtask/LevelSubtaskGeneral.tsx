import { Level, OptionProject } from '../../../../../../types';
import './levelSubtask.css';
import { isOpenCardRegisteTask$ } from '../../../../../../services/sharingSubject';
import { RootState } from '../../../../../../store';
import { useSelector } from 'react-redux';
import { LevelItemSubtaskGeneral } from '../levelItemSubtask';
import { useContext } from 'react';
import { ProjectContext } from '../../../../../../context';

interface LevelSutaskProps {
  option: OptionProject;
  level: Level;
}
const LevelSubtaskGeneral = ({ level, option }: LevelSutaskProps) => {
  const { dayTask } = useContext(ProjectContext);

  const { id: userSessionId } = useSelector(
    (state: RootState) => state.userSession
  );
  const modAuthProject = useSelector(
    (state: RootState) => state.modAuthProject
  );

  const modAuthArea = modAuthProject || userSessionId === level.userId;
  const { subTasks, id: levelId } = level;

  const handleAddTask = () => {
    isOpenCardRegisteTask$.setSubject = {
      isOpen: true,
      levelId,
      option,
    };
  };

  return (
    <div className="levelSubtask">
      <div className="levelSubtask-content levelSubtask-header">
        <div className="levelSubtask-item levelSubtask-item--name">
          <div className="levelSubtask-header-title">NOMBRE</div>
        </div>
        <div className="levelSubtask-item">
          <div className="levelSubtask-header-title">DIAS </div>
        </div>
        <div className="levelSubtask-item">
          <div className="levelSubtask-header-title">PORCENTAJE </div>
        </div>
        <div className="levelSubtask-item">
          <div className="levelSubtask-header-title">PRECIO</div>
        </div>
        <div className="levelSubtask-item">
          <div className="levelSubtask-header-title">ESTADO</div>
        </div>
        <div className="levelSubtask-item">
          <div className="levelSubtask-header-title">USUARIO ASIGNADO</div>
        </div>
      </div>
      {subTasks?.map(subtask => (
        <LevelItemSubtaskGeneral
          option={option}
          key={subtask.id}
          levelId={levelId}
          modAuthArea={modAuthArea}
          subtask={subtask}
        />
      ))}

      {modAuthArea && !dayTask.isEdit && (
        <div className="levelSubtask-add" onClick={handleAddTask}>
          <span className="levelSubtask-plus">+</span> Agregar tarea
        </div>
      )}
    </div>
  );
};

export default LevelSubtaskGeneral;
