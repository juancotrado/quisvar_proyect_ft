import './listpersonalTask.css';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../services/axiosInstance';
import { motion } from 'framer-motion';
import list_icon from '/svg/task_list.svg';
import MyTaskCard from '../../components/shared/card/MyTaskCard';
import { SubtaskIncludes } from '../../types/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const spring = {
  type: 'spring',
  stiffness: 150,
  damping: 30,
};

const ListPersonalTask = () => {
  const [isOn, setIsOn] = useState(false);
  const { userSession } = useSelector((state: RootState) => state);
  const { id } = userSession;
  const [subTask, setSubTask] = useState<SubtaskIncludes[] | null>(null);

  useEffect(() => {
    axiosInstance
      .get(`/users/${id}/subTasks`)
      .then(res => {
        setSubTask(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, [userSession]);
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
          {subTask &&
            subTask
              ?.filter(({ status }) =>
                !isOn
                  ? ['INREVIEW', 'PROCESS', 'DENIED'].includes(status)
                  : status === 'DONE'
              )
              .map(subTask => (
                <div key={subTask.id}>
                  <MyTaskCard subTask={subTask} />{' '}
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default ListPersonalTask;
