import './listpersonalTask.css';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../services/axiosInstance';
import { motion } from 'framer-motion';
import MyTaskCard from '../../components/shared/card/myTaskCard/MyTaskCard';
import { SubtaskIncludes } from '../../types/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const spring = {
  type: 'spring',
  stiffness: 150,
  damping: 30,
};

export const ListPersonalTask = () => {
  const [isOn, setIsOn] = useState(false);
  const { userSession } = useSelector((state: RootState) => state);
  const { id } = userSession;
  const [subTask, setSubTask] = useState<SubtaskIncludes[] | null>(null);

  useEffect(() => {
    if (id)
      axiosInstance.get(`/users/${id}/subTasks`).then(res => {
        setSubTask(res.data);
      });
  }, [userSession, id]);

  const toggleSwitch = () => {
    setIsOn(!isOn);
  };

  return (
    <div className="my-container-list ">
      <div className="container-list-task">
        <h1 className="main-title">
          MIS <span className="main-title-span">TAREAS </span>
        </h1>
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
          {subTask
            ?.filter(({ status }) =>
              !isOn
                ? ['INREVIEW', 'PROCESS', 'DENIED'].includes(status)
                : status === 'DONE'
            )
            .map(subTask => (
              <div key={subTask.id} className="sub-cards">
                <MyTaskCard subTask={subTask} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
