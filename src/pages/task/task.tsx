// import React from 'react';
import './task.css';
import list_icon from '/svg/task_list.svg';
import TaskCard from '../../components/shared/card/TaskCard';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../services/axiosInstance';
import { TaskType } from '../../types/types';

const Task = () => {
  const [tasks, setTasks] = useState<TaskType[] | null>(null);
  const { id } = useParams();

  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = () => {
    axiosInstance
      .get(`/projects/${id}`)
      .then(res => {
        console.log(res.data.tasks);
        setTasks(res.data.tasks);
      })
      .catch(err => console.log(err));
  };
  // const handleReload = () => setNeedReload(true);
  // console.log(needReload);
  return (
    <div className="container-list">
      <div className="title-list">
        <img className="task-icon" src={list_icon} alt="task-list" />
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
