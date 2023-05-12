// import React from 'react';
import './task.css';
import list_icon from '/svg/task_list.svg';
import TaskCard, { taskData } from '../../components/shared/card/TaskCard';
const Task = () => {
  const data: taskData = {
    id: 1,
    area: 'Recursos Humanos',
    status: 'UNRESOLVED',
    title: 'Título del proyecto',
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
  };
  return (
    <div className="container-list">
      <div className="title-list">
        <img className="task-icon" src={list_icon} alt="task-list" />
        <h2>Lista de tareas</h2>
      </div>
      <section>
        <div className="container-task container-unresolved">
          <h3>Por hacer</h3>
          <TaskCard data={data} />
          <TaskCard data={data} />
          <TaskCard data={data} />
          <TaskCard data={data} />
          <TaskCard data={data} />
        </div>
        <div className="container-task container-process">
          <h3>Haciendo</h3>
          <TaskCard data={data} />
        </div>
        <div className="container-task container-done">
          <h3>Hecho</h3>
          <TaskCard data={data} />
        </div>
      </section>
    </div>
  );
};

export default Task;
