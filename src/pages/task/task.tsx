// import React from 'react';
import './task.css';
import TaskCard from '../../components/shared/card/TaskCard';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../services/axiosInstance';
import { Employees, TaskType } from '../../types/types';
import useSocket from '../../hooks/useSocket';
import ModalFormTask from '../../components/tasks/modalFormTask/ModalFormTask';
import useRole from '../../hooks/useRole';
import Button from '../../components/shared/button/Button';
import { isOpenModal$ } from '../../services/sharingSubject';

const Task = () => {
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

  return (
    <div className="tasks container">
      <div className="tasks-head">
        <h1 className="main-title">
          LISTA DE <span className="main-title-span">TAREAS</span>
        </h1>
        {/* {role !== 'EMPLOYEE' && (
          <Button
            text="Agregar"
            icon="plus"
            className="btn-add"
            onClick={addNewTask}
          />
        )} */}
      </div>

      <section className="tasks-section-container">
        <div className="container-task container-unresolved">
          {/* <h3>Por hacer</h3>
          {tasks &&
            tasks
              .filter(({ status }) => status === 'UNRESOLVED')
              .map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  editTaskStatus={editTaskStatus}
                  handleGetTaskData={handleGetTaskData}
                  deleteTask={deleteTask}
                />
              ))} */}
        </div>
        <div className="container-task container-process">
          <h3>Haciendo</h3>
          {/* {tasks &&
            tasks
              .filter(({ status }) => status === 'PROCESS')
              .map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  editTaskStatus={editTaskStatus}
                  handleGetTaskData={handleGetTaskData}
                  deleteTask={deleteTask}
                />
              ))} */}
        </div>
        <div className="container-task container-done">
          <h3>Hecho</h3>
          {/* {tasks &&
            tasks
              .filter(({ status }) => status === 'DONE')
              .map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  editTaskStatus={editTaskStatus}
                  handleGetTaskData={handleGetTaskData}
                  deleteTask={deleteTask}
                />
              ))} */}

          {/* {tasks && <TaskCard task={tasks} />} */}
        </div>
      </section>
      {/* <div className="tasks-online-container">
        <h4 className="task-online-number">
          Usuarios Conectados: {userOnline}
        </h4>
      </div> */}
      {/* <ModalFormTask
        createTask={createTask}
        getTaskData={getTaskData}
        editTask={editTask}
      /> */}
    </div>
  );
};

export default Task;
