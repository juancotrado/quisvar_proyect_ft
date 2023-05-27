import './listpersonalTask.css';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../services/axiosInstance';
import { motion } from 'framer-motion';
import list_icon from '/svg/task_list.svg';
import MyTaskCard from '../../components/shared/card/MyTaskCard';
import { TaskType } from '../../types/types';

const spring = {
  type: 'spring',
  stiffness: 150,
  damping: 30,
};
const ListPersonalTask = () => {
  const [tasks, setTasks] = useState<TaskType[] | null>(null);
  const [isOn, setIsOn] = useState(false);
  useEffect(() => {
    const data = localStorage.getItem('personalData');
    if (typeof data !== 'string') return;
    const personalData = JSON.parse(data);
    const { id } = personalData;

    axiosInstance
      .get(`/users/${id}/tasks`)
      .then(res => {
        setTasks(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const toggleSwitch = () => {
    setIsOn(!isOn);
  };

  return (
    <div className="my-container-list ">
      <div className="my-title-list">
        <img className="task-icon" src={list_icon} alt="task-list" />
        <h2>Mis tareas</h2>
      </div>

      <div className="container-list-task">
        <div className="header-of-header">
          <span>Ordenar por:</span>
          <div className="switch" data-ison={isOn} onClick={toggleSwitch}>
            <motion.div
              className={`handle ${isOn ? 'handle2' : ''}`}
              layout
              transition={spring}
            >
              <span className="span-list-task">
                {isOn ? 'Hecho' : 'En Proceso'}
              </span>
            </motion.div>
          </div>
        </div>
        <div className="cards">
          {tasks &&
            tasks
              ?.filter(
                ({ status }) => status === `${isOn ? 'DONE' : 'PROCESS'}`
              )
              .map(task => (
                <div key={task.id}>
                  <MyTaskCard task={task} />{' '}
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default ListPersonalTask;
