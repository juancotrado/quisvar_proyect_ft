// import React from 'react';
import './task.css';
import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { axiosInstance } from '../../services/axiosInstance';
import { SubTask, WorkArea } from '../../types/types';
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
const Task = () => {
  const { id } = useParams();

  const [workArea, setWorkArea] = useState<WorkArea | null>(null);
  const [subTasks, setSubTasks] = useState<SubTask[] | null>(null);
  const [subTask, setSubTask] = useState<SubTask>(initValuesSubTask);
  const socket = useContext(SocketContext);
  const { role } = useSelector((state: RootState) => state.userSession);

  useEffect(() => {
    axiosInstance.get(`/workareas/${id}`).then(res => setWorkArea(res.data));
  }, [id]);

  const settingSubTasks = (id: number) => {
    axiosInstance.get(`/tasks/${id}`).then(res => {
      setSubTasks(res.data.subTasks);
      socket.emit('join', res.data.id);
      isOpenModal$.setSubject = false;
    });
  };

  const getSubtask = (subTask: SubTask) => {
    setSubTask(subTask);
    isTaskInformation$.setSubject = true;
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
    socket.on('server:create-subTask', (newSubTask: SubTask) => {
      if (!subTasks) return;
      setSubTasks([...subTasks, newSubTask]);
    });

    return () => {
      socket.off('server:create-subTask');
    };
  }, [socket, subTasks]);

  // useEffect(() => {
  //   socket.on('server:upload-file-subTask', (newSubTask: SubTask) => {
  //     setSubTask(newSubTask);
  //   });

  //   return () => {
  //     socket.off('server:upload-file-subTask');
  //   };
  // }, [socket, subTask]);
  //   const [tasks, setTasks] = useState<TaskType[] | null>(null);
  //   const [getTaskData, setGetTaskData] = useState<TaskType | null>(null);
  //   const socket = useSocket();
  //   const { id } = useParams();
  //   const { role } = useRole();

  //   useEffect(() => {
  //     axiosInstance
  //       .get(`/projects/${id}`)
  //       .then(res => {
  //         setTasks(res.data.tasks);
  //         socket.emit('data', res.data.tasks);
  //       })
  //       .catch(err => console.log(err));

  //     return () => {
  //       socket.disconnect();
  //     };
  //   }, [id, socket]);

  //   useEffect(() => {
  //     socket.on('data', (tasksSocket: TaskType[]) => {
  //       if (tasks && tasksSocket[0].projectId === tasks[0].projectId) {
  //         setTasks(tasksSocket);
  //       }
  //     });
  //   }, [socket, tasks]);

  //   useEffect(() => {
  //     socket.on('add-task', newTask => {
  //       if (!tasks) return;
  //       setTasks([...tasks, newTask]);
  //     });
  //   }, [socket, tasks]);

  //   useEffect(() => {
  //     socket.on('update-task', updateTask => {
  //       if (!tasks) return;
  //       const newTasks = tasks?.map(task =>
  //         task.id == updateTask.id ? updateTask : task
  //       );
  //       setTasks(newTasks);
  //     });
  //   }, [socket, tasks]);

  //   useEffect(() => {
  //     socket.on('delete-task-success', id => {
  //       if (!tasks) return;
  //       const newTasks = tasks.filter(task => task.id !== id);
  //       setTasks(newTasks);
  //     });
  //   }, [socket, tasks]);

  //   const editTaskStatus = (
  //     id: number,
  //     status: string,
  //     newEmployees: Employees[] = []
  //   ) => {
  //     if (!tasks) return;
  //     const personalData = localStorage.getItem('personalData');
  //     if (!personalData) return;
  //     const personalDataParse = JSON.parse(personalData);

  //     const newTasks = tasks?.map(task =>
  //       task.id == id ? { ...task, status, employees: newEmployees } : task
  //     );
  //     socket.emit('update-status', {
  //       id,
  //       body: { status },
  //       userId: personalDataParse.id,
  //     });
  //     socket.emit('data', newTasks);
  //     setTasks(newTasks);
  //   };

  //   const addNewTask = () => {
  //     clearDataInModal();
  //     isOpenModal$.setSubject = true;
  //   };

  //   const createTask = (task: TaskType) => {
  //     socket.emit('create-task', task);
  //     clearDataInModal();
  //   };
  //   const editTask = (task: TaskType) => {
  //     socket.emit('edit-task', task);
  //     clearDataInModal();
  //   };

  //   const deleteTask = (id: number) => {
  //     socket.emit('delete-task', id);
  //   };
  //   const clearDataInModal = () => setGetTaskData(null);

  //   const handleGetTaskData = (getTask: TaskType) => setGetTaskData(getTask);
  const taskId = subTasks?.at(0)?.taskId;
  const openModaltoAdd = () => (isTaskInformation$.setSubject = false);
  return (
    <>
      <div className="tasks container">
        <div className="tasks-head">
          <h1 className="main-title">
            LISTA DE <span className="main-title-span">TAREAS</span>
          </h1>
          {role !== 'EMPLOYEE' && subTasks && (
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

                    // editTaskStatus={editTaskStatus}
                    // handleGetTaskData={handleGetTaskData}
                    // deleteTask={deleteTask}
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
        {workArea && taskId && (
          <CardRegisterAndInformation
            subTask={subTask}
            coordinatorId={workArea?.userId}
            taskId={taskId}
          />
        )}
      </div>
      {workArea && (
        <Sidebar workArea={workArea} settingSubTasks={settingSubTasks} />
      )}
    </>
  );
};

export default Task;
