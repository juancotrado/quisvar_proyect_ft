import './mytaskcard.css';
import icon_done from '/svg/task_done.svg';
import { useState } from 'react';
import { SubTask, SubTaskType } from '../../../types/types';
import icon_list_task from '/svg/icon_list_task.svg';
import { _date } from '../../../utils/formatDate';
import CardRegisterAndInformation from './cardRegisterAndInformation/CardRegisterAndInformation';
import { isTaskInformation$ } from '../../../services/sharingSubject';

interface TaskCardProps {
  task: SubTaskType;
  getSubtask: (value: SubTask) => void;
}

const MyTaskCard = ({ task, getSubtask }: TaskCardProps) => {
  const hanldeViewMore = () => {
    getSubtask(task);
  };
  return (
    <div className="my-task-class">
      <span className={`my-icon-card`}>
        <img
          src={
            task.status === 'DONE'
              ? icon_done
              : task.status === 'PROCESS'
              ? icon_list_task
              : ''
          }
        />
      </span>
      <div className="my-task-content">
        <div className="task-header">
          <h2>{task.name}</h2>
          <span>Precio: S/{task.price}</span>
        </div>
        <ul>
          <h3>{task.description} </h3>
          {/* {subtasks &&
            subtasks.map(subtask => (
              <li key={subtask.id}>{subtask.description}</li>
            ))} */}
        </ul>
      </div>
      <div className="footer-my-task">
        <h3>Fecha Inicio: {`${_date(task.createdAt)}`}</h3>
        <span onClick={hanldeViewMore}>Ver mas</span>
      </div>
    </div>
  );
};

export default MyTaskCard;
