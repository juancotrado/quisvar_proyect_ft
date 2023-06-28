/* eslint-disable react-hooks/exhaustive-deps */
// import React from 'react';
import './tasks.css';
import { useLocation, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
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
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const initValuesSubTask: SubTask = {
  id: 0,
  status: '',
  name: '',
  percentage: 0,
  description: '',
  price: '',
  hours: 0,
  files: [],
  taskId: 0,
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
  const [workArea, setWorkArea] = useState<WorkArea | null>(null);
  const [subTasks, setSubTasks] = useState<SubTask[] | null>(null);
  const [typeTask, setTypeTask] = useState<TypeTask>();
  const [isOpen, setIsOpen] = useState(false);
  const [subTask, setSubTask] = useState<SubTask>(initValuesSubTask);
  const [taskId, setTaskId] = useState<number | null>(null);
  const socket = useContext(SocketContext);
  const { id: userSessionId } = useSelector(
    (state: RootState) => state.userSession
  );

  useEffect(() => {
    getWorkAreas();
  }, []);

  const getWorkAreas = async () => {
    axiosInstance.get(`/workareas/${id}`).then(res => {
      setWorkArea(res.data);
      setIsOpen(true);
    });
  };

  const querySubTask = (url: string, type: TypeTask) => {
    return new Promise<SubTask[]>(resolve => {
      axiosInstance.get(url).then(res => {
        setTaskId(res.data.id);
        setTypeTask(type);
        setSubTasks(res.data.subTasks);
        socket.emit('join', res.data.id + type);
        isOpenModal$.setSubject = false;
        resolve(res.data.subTasks);
      });
    });
  };

  const settingSubTasks = (id: number, type: TypeTask) => {
    return querySubTask(`/${path[type]}/${id}`, type);
  };

  const getSubtask = (subTask: SubTask) => {
    setSubTask(subTask);
    isTaskInformation$.setSubject = true;
  };

  useEffect(() => {
    if (state?.taskIdProp && state?.subTaskIdProp) {
      openMySubTask();
    }
  }, []);

  const openMySubTask = async () => {
    const { taskIdProp, subTaskType, subTaskIdProp } = state;
    const subTasksSelected = await settingSubTasks(taskIdProp, subTaskType);
    const subTaskSelect = subTasksSelected?.find(
      subTask => subTask.id === subTaskIdProp
    );
    if (!subTaskSelect) return;
    getSubtask(subTaskSelect);
  };
  useEffect(() => {
    socket.on('server:update-subTask', (newSubTask: SubTask) => {
      if (!subTasks) return;
      const newSubTasks = subTasks?.map(subTask =>
        subTask.id == newSubTask.id ? newSubTask : subTask
      );
      setSubTask(newSubTask);
      setSubTasks(newSubTasks);
    });

    return () => {
      socket.off('server:update-subTask');
    };
  }, [socket, subTasks]);
  useEffect(() => {
    socket.on('server:delete-subTask', (newSubTask: SubTask) => {
      if (!subTasks) return;
      const newSubTasks = subTasks?.filter(
        subTask => subTask.id !== newSubTask.id
      );
      setSubTasks(newSubTasks);
    });

    return () => {
      socket.off('server:delete-subTask');
    };
  }, [socket, subTasks]);

  useEffect(() => {
    socket.on('server:create-subTask', (newSubTask: SubTask) => {
      console.log({ newSubTask });
      if (!subTasks) return;
      setSubTasks([...subTasks, newSubTask]);
    });

    return () => {
      socket.off('server:create-subTask');
    };
  }, [socket, subTasks]);

  const isAuthorizedMod = userSessionId === workArea?.userId;

  const openModaltoAdd = () => (isTaskInformation$.setSubject = false);
  return (
    <>
      <div className="tasks container">
        <div className="tasks-head">
          <h1 className="main-title">
            LISTA DE <span className="main-title-span">TAREAS</span>
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
        <section className="tasks-section-container">
          <div className="container-task container-unresolved">
            <h3>Por hacer</h3>
            {subTasks &&
              subTasks
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
            {subTasks &&
              subTasks
                .filter(
                  ({ status }) => status !== 'UNRESOLVED' && status !== 'DONE'
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
            {subTasks &&
              subTasks
                .filter(({ status }) => status === 'DONE')
                .map(subTask => (
                  <SubTaskCard
                    key={subTask.id}
                    subTask={subTask}
                    getSubtask={getSubtask}
                  />
                ))}
          </div>
        </section>
        {
          <CardRegisterAndInformation
            subTask={subTask}
            isAuthorizedMod={isAuthorizedMod}
            taskId={taskId}
            typeTask={typeTask}
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
