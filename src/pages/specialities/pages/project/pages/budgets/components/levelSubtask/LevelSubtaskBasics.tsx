import { NavLink, useParams } from 'react-router-dom';
import { Level, SubTask } from '../../../../../../../../types';
import './levelSubtask.css';
import {
  isOpenButtonDelete$,
  isOpenCardRegisteTask$,
} from '../../../../../../../../services/sharingSubject';
import { RootState } from '../../../../../../../../store';
import { useSelector } from 'react-redux';
import { axiosInstance } from '../../../../../../../../services/axiosInstance';
import { ContextMenuTrigger } from 'rctx-contextmenu';
import { useContext } from 'react';
import { SocketContext } from '../../../../../../../../context';
import { StatusText } from '..';
import {
  DefaultUserImage,
  DotsRight,
  FloatingText,
} from '../../../../../../../../components';

interface LevelSubtaskBasicsProps {
  level: Level;
  onSave?: () => void;
}
export const LevelSubtaskBasics = ({
  level,
  onSave,
}: LevelSubtaskBasicsProps) => {
  const { id: userSessionid } = useSelector(
    (state: RootState) => state.userSession
  );
  const modAuthProject = useSelector(
    (state: RootState) => state.modAuthProject
  );
  const socket = useContext(SocketContext);

  const { stageId } = useParams();
  const modAuthArea = modAuthProject || userSessionid === level.userId;
  const { subTasks, id } = level;

  const handleAddTask = () => {
    isOpenCardRegisteTask$.setSubject = {
      isOpen: true,
      levelId: id,
      typeTask: 'basictasks',
    };
  };
  const handleAddTaskToUpperOrDown = (
    subtask: SubTask,
    type: 'upper' | 'lower'
  ) => {
    isOpenCardRegisteTask$.setSubject = {
      isOpen: true,
      levelId: id,
      task: subtask,
      type,
      typeTask: 'basictasks',
    };
  };
  const handleDeleteTask = (id: number) => {
    axiosInstance.delete(`basictasks/${id}/${stageId}`).then(res => {
      socket.emit('client:update-project', res.data);
    });
  };
  const handleEditTask = (subtask: SubTask) => {
    isOpenCardRegisteTask$.setSubject = {
      isOpen: true,
      levelId: id,
      task: subtask,
      typeTask: 'basictasks',
    };
  };

  const handleDuplicateTask = (subtask: SubTask) => {
    const body = {
      name: `${subtask.name}(${Date.now()})`,
    };
    axiosInstance
      .post(`/duplicates/basictasks/${subtask.id}`, body)
      .then(() => onSave?.());
  };
  const handleOpenButtonDelete = (id: number) => {
    isOpenButtonDelete$.setSubject = {
      isOpen: true,
      function: () => () => handleDeleteTask(id),
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
        <div className="levelSubtask-context-menu" key={subtask.id}>
          <ContextMenuTrigger id={`levelSubtask-${subtask.id}`}>
            <NavLink
              to={`tarea/${subtask.id}`}
              className={({ isActive }) =>
                `levelSubtask-content pointer ${
                  isActive && 'levelSubtask-content-active'
                }`
              }
            >
              <div className="levelSubtask-item levelSubtask-item--name">
                <FloatingText
                  text={subtask.item + ' ' + subtask.name}
                  className="levelSubtask-text"
                  yPos={-40}
                >
                  <div className="levelSubtask-text">
                    {subtask.item}
                    <span className="levelSubtask-text-name">
                      {subtask.name}
                    </span>
                  </div>
                </FloatingText>
              </div>
              <div className="levelSubtask-item">
                <div className="levelSubtask-text">{subtask.days}</div>
              </div>
              <div className="levelSubtask-item">
                <div className="levelSubtask-text">{subtask.percentage}%</div>
              </div>
              <div className="levelSubtask-item">
                <div className="levelSubtask-text">
                  {modAuthArea ? `S/.${subtask.price ?? 0}` : '-'}
                </div>
              </div>
              <div className="levelSubtask-item">
                <StatusText status={subtask.status} />
              </div>
              <div className="levelSubtask-item">
                <div className="levelSubtask-user-image">
                  {subtask?.users?.length ? (
                    subtask.users.map(user => (
                      <DefaultUserImage
                        key={user.user.id}
                        user={user.user.profile}
                      />
                    ))
                  ) : (
                    <div className="levelSubtask-text">No asignado aún</div>
                  )}
                </div>
              </div>
            </NavLink>
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

                  function: () => handleOpenButtonDelete(subtask.id),
                },
                {
                  name: 'Duplicar',
                  type: 'button',
                  icon: 'document-duplicate',

                  function: () => handleDuplicateTask(subtask),
                },
                {
                  name: 'Agregar arriba',
                  type: 'button',
                  icon: 'upper',

                  function: () => handleAddTaskToUpperOrDown(subtask, 'upper'),
                },
                {
                  name: 'Agrega abajo',
                  type: 'button',
                  icon: 'lower',

                  function: () => handleAddTaskToUpperOrDown(subtask, 'lower'),
                },
              ]}
              idContext={`levelSubtask-${subtask.id}`}
            />
          )}
        </div>
      ))}

      {modAuthArea && (
        <div className="levelSubtask-add" onClick={handleAddTask}>
          <span className="levelSubtask-plus">+</span> Agregar tarea
        </div>
      )}
    </div>
  );
};
