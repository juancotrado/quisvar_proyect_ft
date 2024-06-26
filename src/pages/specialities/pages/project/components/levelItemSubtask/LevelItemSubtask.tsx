import { NavLink, useParams } from 'react-router-dom';
import { SubTask } from '../../../../../../types';
import { axiosInstance } from '../../../../../../services/axiosInstance';
import { ContextMenuTrigger } from 'rctx-contextmenu';
import {
  ChangeEvent,
  KeyboardEvent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ProjectContext, SocketContext } from '../../../../../../context';
import { StatusText } from '..';
import {
  DefaultUserImage,
  DotsRight,
  FloatingText,
  Input,
} from '../../../../../../components';
import {
  isOpenButtonDelete$,
  isOpenCardRegisteTask$,
} from '../../../../../../services/sharingSubject';

interface LevelItemSubtaskProps {
  subtask: SubTask;
  levelId: number;
  modAuthArea: boolean;
  onSave?: () => void;
}

const LevelItemSubtask = ({
  subtask,
  levelId,
  modAuthArea,
  onSave,
}: LevelItemSubtaskProps) => {
  const { dayTask } = useContext(ProjectContext);

  const [inputDay, setInputDay] = useState(String(subtask.days));
  const socket = useContext(SocketContext);

  const { stageId } = useParams();

  const handleAddTaskToUpperOrDown = (
    subtask: SubTask,
    type: 'upper' | 'lower'
  ) => {
    isOpenCardRegisteTask$.setSubject = {
      isOpen: true,
      levelId,
      task: subtask,
      type,
      option: 'budget',
    };
  };
  const handleDeleteTask = (id: number) => {
    axiosInstance.delete(`subtasks/${id}/${stageId}`).then(res => {
      socket.emit('client:update-project', res.data);
    });
  };
  const handleEditTask = (subtask: SubTask) => {
    isOpenCardRegisteTask$.setSubject = {
      isOpen: true,
      levelId,
      task: subtask,
      option: 'budget',
    };
  };

  const handleDuplicateTask = (subtask: SubTask) => {
    const body = {
      name: `${subtask.name}(${Date.now()})`,
    };
    axiosInstance
      .post(`/duplicates/subtask/${subtask.id}`, body)
      .then(() => onSave?.());
  };
  const handleOpenButtonDelete = (id: number) => {
    isOpenButtonDelete$.setSubject = {
      isOpen: true,
      function: () => () => handleDeleteTask(id),
    };
  };

  const pressKeydown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!dayTask.refs) return;
    const { pos } = dayTask.refs[subtask.id];
    let valueSum = 0;
    if (e.key === 'ArrowUp') valueSum = -1;
    if (e.key === 'ArrowDown') valueSum = +1;
    if (valueSum === 0) return;
    const nextRef = Object.values(dayTask.refs).find(
      day => day.pos === valueSum + pos
    );
    nextRef?.ref.current?.select();
  };

  const onChangeDay = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    setInputDay(value);
  };

  useEffect(() => {
    setInputDay(String(subtask.days));
  }, [dayTask.isEdit]);

  return (
    <div className="levelSubtask-context-menu" key={subtask.id}>
      <ContextMenuTrigger id={`levelSubtask-${subtask.id}`}>
        <NavLink
          to={dayTask.isEdit ? '' : `tarea/${subtask.id}`}
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
                <span className="levelSubtask-text-name">{subtask.name}</span>
              </div>
            </FloatingText>
          </div>
          <div className="levelSubtask-item">
            {dayTask.isEdit ? (
              <div style={{ width: '3rem' }}>
                <div className="projectLevel-input-name">
                  {dayTask.refs && (
                    <Input
                      onChange={onChangeDay}
                      style={{
                        textAlign: 'center',
                      }}
                      value={inputDay}
                      onKeyDown={pressKeydown}
                      name="days"
                      styleInput={3}
                      autoComplete="off"
                      ref={dayTask.refs[subtask.id].ref}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="levelSubtask-text">{subtask.days}</div>
            )}
          </div>
          <div className="levelSubtask-item">
            <div className="levelSubtask-text">{subtask.percentage}%</div>
          </div>
          <div className="levelSubtask-item">
            <div className="levelSubtask-text">
              {modAuthArea ? `S/.${subtask.price}` : '-'}
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
  );
};

export default LevelItemSubtask;
