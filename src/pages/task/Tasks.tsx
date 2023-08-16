import './tasks.css';
import { useLocation, useParams } from 'react-router-dom';
import { useCallback, useContext, useEffect, useState } from 'react';
import { axiosInstance } from '../../services/axiosInstance';
import { SubTask, TypeTask, WorkArea } from '../../types/types';
import { Sidebar, SubTaskCard } from '../../components';
import { SocketContext } from '../../context/SocketContex';
import {
  isOpenModal$,
  isTaskInformation$,
} from '../../services/sharingSubject';
import Button from '../../components/shared/button/Button';
import CardRegisterAndInformation from '../../components/shared/card/cardRegisterAndInformation/CardRegisterAndInformation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { setModAuth } from '../../store/slices/modAuth.slice';

const initValuesSubTask: SubTask = {
  id: 0,
  status: 'UNRESOLVED',
  name: '',
  feedBacks: [],
  percentage: 0,
  description: '',
  price: '',
  hours: 0,
  files: [],
  taskId: 0,
  indexTaskId: 0,
  task_2_Id: 0,
  task_3_Id: 0,
  users: [],
};
const path = {
  task: 'tasks',
  task2: 'tasks2',
  task3: 'tasks3',
  indextask: 'indextasks',
};

const Tasks = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const [data, setData] = useState<SubTask>();
  const [workArea, setWorkArea] = useState<WorkArea | null>(null);
  const [subTasks, setSubTasks] = useState<SubTask[] | null>(null);
  const [typeTask, setTypeTask] = useState<TypeTask>();
  const [subTask, setSubTask] = useState<SubTask>(initValuesSubTask);
  const [taskId, setTaskId] = useState<number | null>(null);
  const socket = useContext(SocketContext);
  const dispatch: AppDispatch = useDispatch();

  const { id: userSessionId, role } = useSelector(
    (state: RootState) => state.userSession
  );
  const getWorkAreas = useCallback(async () => {
    axiosInstance.get(`/workareas/${id}`).then(res => {
      setWorkArea(res.data);
      const isAuthorizedMod =
        userSessionId === res.data.userId || role === 'ADMIN';
      dispatch(setModAuth(isAuthorizedMod));
    });
  }, [dispatch, id, role, userSessionId]);

  useEffect(() => {
    if (userSessionId !== 0) {
      getWorkAreas();
    }
  }, [userSessionId, getWorkAreas]);

  const querySubTask = useCallback(
    (url: string, type: TypeTask) => {
      return new Promise<SubTask[]>(resolve => {
        axiosInstance.get(url).then(res => {
          setTaskId(res.data.id);
          setTypeTask(type);
          setData(res.data);
          setSubTasks(res.data.subTasks);
          socket.emit('join', res.data.id + type);
          isOpenModal$.setSubject = false;
          resolve(res.data.subTasks);
        });
      });
    },
    [socket]
  );

  const settingSubTasks = useCallback(
    (id: number, type: TypeTask) => {
      return querySubTask(`/${path[type]}/${id}`, type);
    },
    [querySubTask]
  );

  const getSubtask = (subTask: SubTask) => {
    setSubTask(subTask);
    isTaskInformation$.setSubject = true;
  };

  const openMySubTask = useCallback(async () => {
    const { taskIdProp, subTaskType, subTaskIdProp } = state;
    const subTasksSelected = await settingSubTasks(taskIdProp, subTaskType);
    const subTaskSelect = subTasksSelected?.find(
      subTask => subTask.id === subTaskIdProp
    );
    if (!subTaskSelect) return;
    getSubtask(subTaskSelect);
  }, [settingSubTasks, state]);

  useEffect(() => {
    if (state?.taskIdProp && state?.subTaskIdProp) {
      openMySubTask();
    }
  }, [openMySubTask, state?.taskIdProp, state?.subTaskIdProp]);

  useEffect(() => {
    socket.on('server:update-subTask', (newSubTask: SubTask) => {
      if (!subTasks) return;
      const newSubTasks = subTasks?.map(subTask =>
        subTask.id == newSubTask.id ? newSubTask : subTask
      );
      if (subTask.id === newSubTask.id) setSubTask(newSubTask);
      setSubTasks(newSubTasks);
    });

    return () => {
      socket.off('server:update-subTask');
    };
  }, [socket, subTasks, subTask]);
  useEffect(() => {
    socket.on('server:delete-subTask', (newSubTasks: SubTask[]) => {
      setSubTasks(newSubTasks);
    });

    return () => {
      socket.off('server:delete-subTask');
    };
  }, [socket, subTasks]);

  useEffect(() => {
    socket.on('server:create-subTask', (newSubTask: SubTask) => {
      if (!subTasks) return;
      setSubTasks([...subTasks, newSubTask]);
    });

    return () => {
      socket.off('server:create-subTask');
    };
  }, [socket, subTasks]);

  const isAuthorizedMod =
    userSessionId === workArea?.userId || role === 'ADMIN';

  const getText = () => {
    if (subTasks === null)
      return 'Seleccione uno de las indices para ver las tareas disponibles.';
    if (subTasks.length === 0) {
      return role === 'EMPLOYEE'
        ? 'Este indice no tiene tareas, elije otra indice.'
        : 'Este indice no tiene tareas, agregue una nueva tarea.';
    }
  };

  const openModaltoAdd = () => (isTaskInformation$.setSubject = false);
  return (
    <>
      <div className="task container">
        <div className="tasks-head">
          <h1 className="main-title">
            LISTA DE <span className="main-title-span">TAREAS</span>{' '}
            <span className="main-title-index">{data?.name}</span>
          </h1>

          {isAuthorizedMod && subTasks && (
            <Button
              text="Agregar"
              icon="plus"
              className="btn-add"
              onClick={openModaltoAdd}
            />
          )}
        </div>
        {subTasks?.length ? (
          <section className="tasks-section-container">
            <div className="container-task container-unresolved">
              <h3>Por hacer</h3>
              {subTasks
                .filter(({ status }) => status === 'UNRESOLVED')
                .map(subTask => (
                  <SubTaskCard
                    key={subTask.id}
                    subTask={subTask}
                    getSubtask={getSubtask}
                  />
                ))}
            </div>
            <div className="container-task container-process">
              <h3>Haciendo</h3>
              {subTasks
                .filter(
                  ({ status }) =>
                    status === 'PROCESS' ||
                    status === 'INREVIEW' ||
                    status === 'DENIED'
                )
                .map(subTask => (
                  <SubTaskCard
                    key={subTask.id}
                    subTask={subTask}
                    getSubtask={getSubtask}
                  />
                ))}
            </div>
            <div className="container-task container-done">
              <h3>Hecho</h3>
              {subTasks
                .filter(
                  ({ status }) => status === 'DONE' || status === 'LIQUIDATION'
                )
                .map(subTask => (
                  <SubTaskCard
                    key={subTask.id}
                    subTask={subTask}
                    getSubtask={getSubtask}
                  />
                ))}
            </div>
          </section>
        ) : (
          <div className="task-empty">
            <p className="task-empty-paragraph">{getText()}</p>
          </div>
        )}
        {
          <CardRegisterAndInformation
            subTask={subTask}
            taskId={taskId}
            typeTask={typeTask}
            adminId={workArea?.userId}
          />
        }
      </div>
      {workArea && (
        <Sidebar
          workArea={workArea}
          settingSubTasks={settingSubTasks}
          onUpdate={getWorkAreas}
          isShowInitValue={state?.taskIdProp === undefined}
        />
      )}
    </>
  );
};

export default Tasks;
