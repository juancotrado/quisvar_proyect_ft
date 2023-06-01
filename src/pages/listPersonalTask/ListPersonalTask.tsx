import './listpersonalTask.css';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../services/axiosInstance';
import { motion } from 'framer-motion';
import list_icon from '/svg/task_list.svg';
import MyTaskCard from '../../components/shared/card/MyTaskCard';
import { SubTask, SubTaskType } from '../../types/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import CardRegisterAndInformation from '../../components/shared/card/cardRegisterAndInformation/CardRegisterAndInformation';
import { isTaskInformation$ } from '../../services/sharingSubject';

const spring = {
  type: 'spring',
  stiffness: 150,
  damping: 30,
};
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
const ListPersonalTask = () => {
  const [tasks, setTasks] = useState<SubTaskType[] | null>(null);
  const [isOn, setIsOn] = useState(false);
  const { userSession } = useSelector((state: RootState) => state);
  const { id } = userSession;
  const [subTask, setSubTask] = useState<SubTask>(initValuesSubTask);
  const getSubtask = (subTask: SubTask) => {
    setSubTask(subTask);
    isTaskInformation$.setSubject = true;
  };

  useEffect(() => {
    axiosInstance
      .get(`/users/${id}/subTasks`)
      .then(res => {
        // console.log(res.data);
        setTasks(res.data);
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
          {tasks &&
            tasks
              ?.filter(
                ({ status }) => status === `${isOn ? 'DONE' : 'PROCESS'}`
              )
              .map(task => (
                <div key={task.id}>
                  <MyTaskCard task={task} getSubtask={getSubtask} />{' '}
                </div>
              ))}
        </div>
      </div>
      {<CardRegisterAndInformation subTask={subTask} coordinatorId={id} />}
    </div>
  );
};

export default ListPersonalTask;
