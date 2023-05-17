// import React from 'react';
import './task.css';
import list_icon from '/svg/task_list.svg';
import TaskCard from '../../components/shared/card/TaskCard';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../services/axiosInstance';
import { TaskType } from '../../types/types';

import io from 'socket.io-client';

const socket = io('http://localhost:8082');

const Task = () => {
  const [tasks, setTasks] = useState<TaskType[] | null>(null);
  const [idProject, setIdProject] = useState('example');
  const { id } = useParams();

  useEffect(() => {
    if (!tasks) {
      getTasks();
    }

    const reciveData = (value: any) => {
      console.log('projectName', value.id);
      console.log('projectName2', idProject);

      if (value.id == idProject) {
        setTasks(value.tasks);
      }
    };
    socket.on('data', reciveData);
    return () => {
      socket.off('data', reciveData);
    };
  }, [tasks]);

  const getTasks = () => {
    axiosInstance
      .get(`/projects/${id}`)
      .then(res => {
        setTasks(res.data.tasks);
        setIdProject(res.data.id);
        socket.emit('data', { tasks: res.data.tasks, id: res.data.id });
      })
      .catch(err => console.log(err));
  };
  // const handleReload = () => setNeedReload(true);
  // console.log(needReload);
  return (
    <div className="container-list">
      <div className="title-list">
        <h2>Lista de tareas</h2>
      </div>
      <section>
        <div className="container-task container-unresolved">
          <h3>Por hacer</h3>
          {tasks &&
            tasks
              .filter(({ status }) => status === 'UNRESOLVED')
              .map(task => <TaskCard task={task} getTasks={getTasks} />)}
        </div>
        <div className="container-task container-process">
          <h3>Haciendo</h3>
          {tasks &&
            tasks
              .filter(({ status }) => status === 'PROCESS')
              .map(task => <TaskCard task={task} getTasks={getTasks} />)}
        </div>
        <div className="container-task container-done">
          <h3>Hecho</h3>
          {tasks &&
            tasks
              .filter(({ status }) => status === 'DONE')
              .map(task => <TaskCard task={task} getTasks={getTasks} />)}

          {/* {tasks && <TaskCard task={tasks} />} */}
        </div>
      </section>
    </div>
  );
};

export default Task;
