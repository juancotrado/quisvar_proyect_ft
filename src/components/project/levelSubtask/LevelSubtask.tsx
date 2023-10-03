import { useNavigate, useParams } from 'react-router-dom';
import { Level, SubTask } from '../../../types/types';
import './levelSubtask.css';
import { isOpenCardRegisteTask$ } from '../../../services/sharingSubject';
import Button from '../../shared/button/Button';
import { RootState } from '../../../store';
import { useSelector } from 'react-redux';
import StatusText from '../../shared/statusText/StatusText';
import DefaultUserImage from '../../shared/defaultUserImage/DefaultUserImage';
import { axiosInstance } from '../../../services/axiosInstance';
import DotsRight from '../../shared/dotsRight/DotsRight';
import { ContextMenuTrigger } from 'rctx-contextmenu';
import { useContext } from 'react';
import { SocketContext } from '../../../context/SocketContex';

interface LevelSutaskProps {
  level: Level;
  onSave?: () => void;
}
const LevelSubtask = ({ level, onSave }: LevelSutaskProps) => {
  const { modAuthProject, userSession } = useSelector(
    (state: RootState) => state
  );
  const socket = useContext(SocketContext);

  const { stageId } = useParams();
  const modAuthArea = modAuthProject || userSession.id === level.userId;
  const { subTasks, id } = level;
  const navigate = useNavigate();

  const taskNavigate = (id: number) => {
    navigate(`tarea/${id}`);
  };
  const handleAddTask = () => {
    isOpenCardRegisteTask$.setSubject = { isOpen: true, levelId: id };
  };
  const handleDeleteTask = (id: number) => {
    axiosInstance.delete(`subtasks/${id}/${stageId}`).then(res => {
      socket.emit('client:update-project', res.data);
    });
  };
  const handleEditTask = (subtask: SubTask) => {
    isOpenCardRegisteTask$.setSubject = {
      isOpen: true,
      levelId: id,
      task: subtask,
    };
  };

  const handleDuplicateTask = (subtask: SubTask) => {
    const body = {
      name: subtask.name + ' copia',
    };
    axiosInstance
      .post(`/duplicates/subtask/${subtask.id}`, body)
      .then(() => onSave?.());
  };

  return (
    <div className="levelSubtask">
      <div className="levelSubtask-content levelSubtask-header">
        <div className="levelSubtask-item">
          <div className="levelSubtask-header-title"># ITEM</div>
        </div>
        <div className="levelSubtask-item levelSubtask-item--name">
          <div className="levelSubtask-header-title">NOMBRE</div>{' '}
        </div>
        <div className="levelSubtask-item">
          <div className="levelSubtask-header-title">PRECIO</div>
        </div>
        <div className="levelSubtask-item">
          <div className="levelSubtask-header-title">PORCENTAJE</div>
        </div>
        <div className="levelSubtask-item">
          <div className="levelSubtask-header-title">DIAS</div>
        </div>
        <div className="levelSubtask-item">
          <div className="levelSubtask-header-title">ESTADO</div>
        </div>
        <div className="levelSubtask-item">
          <div className="levelSubtask-header-title">USUARIO ASIGNADO</div>
        </div>
        {modAuthArea && (
          <div className="levelSubtask-item">
            <div className="levelSubtask-header-title">OPCIONES</div>
          </div>
        )}
      </div>
      {subTasks?.map(subtask => (
        <>
          <ContextMenuTrigger
            id={`levelSubtask-${subtask.id}`}
            className="levelSubtask-context-menu"
          >
            <div
              className="levelSubtask-content pointer"
              onClick={() => taskNavigate(subtask.id)}
              key={subtask.id}
            >
              <div className="levelSubtask-item">
                <div className="levelSubtask-text">{subtask.item}</div>
              </div>
              <div className="levelSubtask-item levelSubtask-item--name">
                <div className="levelSubtask-text">{subtask.name}</div>
              </div>
              <div className="levelSubtask-item">
                <div className="levelSubtask-text">S/.{subtask.price}</div>
              </div>
              <div className="levelSubtask-item">
                <div className="levelSubtask-text">{subtask.percentage}%</div>
              </div>
              <div className="levelSubtask-item">
                <div className="levelSubtask-text">{subtask.days}</div>
              </div>
              <div className="levelSubtask-item">
                <StatusText status={subtask.status} />
              </div>
              <div className="levelSubtask-item">
                <div className="levelSubtask-user-image">
                  {subtask?.users?.length
                    ? subtask.users.map(user => (
                        <DefaultUserImage key={user.user.id} user={user} />
                      ))
                    : 'No Asignado aun'}
                </div>
              </div>
              {modAuthArea && (
                <div
                  className="levelSubtask-item"
                  onClick={e => e.stopPropagation()}
                >
                  <Button
                    icon="document-duplicate"
                    className="levelSubtask-btn"
                    onClick={() => handleDuplicateTask(subtask)}
                  />
                  <Button
                    icon="pencil"
                    className="levelSubtask-btn"
                    onClick={() => handleEditTask(subtask)}
                  />
                  <Button
                    icon="trash-red"
                    className="levelSubtask-btn"
                    onClick={() => handleDeleteTask(subtask.id)}
                  />
                </div>
              )}
            </div>
          </ContextMenuTrigger>

          {modAuthArea && (
            <DotsRight
              data={[
                {
                  name: 'Editar',
                  type: 'button',
                  icon: 'pencil',
                  function: () => handleEditTask(subtask),
                },
                {
                  name: 'Eliminar',
                  type: 'button',
                  icon: 'trash-red',

                  function: () => handleDeleteTask(subtask.id),
                },
                {
                  name: 'Duplicar',
                  type: 'button',
                  icon: 'document-duplicate',

                  function: () => handleDuplicateTask(subtask),
                },
              ]}
              idContext={`levelSubtask-${subtask.id}`}
            />
          )}
        </>
      ))}

      {modAuthArea && (
        <div className="levelSubtask-add" onClick={handleAddTask}>
          <span className="levelSubtask-plus">+</span> Agregar tarea
        </div>
      )}
    </div>
  );
};

export default LevelSubtask;
