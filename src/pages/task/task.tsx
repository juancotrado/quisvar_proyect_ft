// import React from 'react';
import './task.css';
import TaskCard from '../../components/shared/card/TaskCard';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../services/axiosInstance';
import { TaskType } from '../../types/types';
import useSocket from '../../hooks/useSocket';
import ModalFormTask from '../../components/tasks/modalFormTask/ModalFormTask';
import useRole from '../../hooks/useRole';
import Button from '../../components/shared/button/Button';

const Task = () => {
  const [tasks, setTasks] = useState<TaskType[] | null>(null);
  const socket = useSocket();
  const { id } = useParams();
  const { role } = useRole();

  useEffect(() => {
    axiosInstance
      .get(`/projects/${id}`)
      .then(res => {
        setTasks(res.data.tasks);
        socket.emit('data', res.data.tasks);
      })
      .catch(err => console.log(err));

    return () => {
      socket.disconnect();
    };
  }, [id, socket]);

  useEffect(() => {
    socket.on('data', (tasksSocket: TaskType[]) => {
      if (tasks && tasksSocket[0].projectId === tasks[0].projectId) {
        setTasks(tasksSocket);
      }
    });
  }, [socket, tasks]);

  const editTasks = (id: number, status: string) => {
    if (!tasks) return;
    const newTasks = tasks?.map(task =>
      task.id == id ? { ...task, status } : task
    );
    socket.emit('update-status', { id, body: { status } });
    socket.emit('data', newTasks);
    setTasks(newTasks);
  };
  return (
    <div className="tasks container">
      <div className="tasks-head">
        <h1 className="main-title">
          LISTA DE <span className="main-title-span">TAREAS</span>
        </h1>
        {role !== 'EMPLOYEE' && (
          <Button
            text="Agregar"
            icon="plus"
            className="btn-add"
            onClick={() => {
              console.log('add');
            }}
          />
        )}
      </div>

      <section className="tasks-section-container">
        <div className="container-task container-unresolved">
          <h3>Por hacer</h3>
          {tasks &&
            tasks
              .filter(({ status }) => status === 'UNRESOLVED')
              .map(task => (
                <TaskCard key={task.id} task={task} editTasks={editTasks} />
              ))}
        </div>
        <div className="container-task container-process">
          <h3>Haciendo</h3>
          {tasks &&
            tasks
              .filter(({ status }) => status === 'PROCESS')
              .map(task => (
                <TaskCard key={task.id} task={task} editTasks={editTasks} />
              ))}
        </div>
        <div className="container-task container-done">
          <h3>Hecho</h3>
          {tasks &&
            tasks
              .filter(({ status }) => status === 'DONE')
              .map(task => (
                <TaskCard key={task.id} task={task} editTasks={editTasks} />
              ))}

          {/* {tasks && <TaskCard task={tasks} />} */}
        </div>
      </section>
      {/* <div className="tasks-online-container">
        <h4 className="task-online-number">
          Usuarios Conectados: {userOnline}
        </h4>
      </div> */}
      <ModalFormTask />
    </div>
  );
};

export default Task;
