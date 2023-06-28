import './listpersonalTask.css';
import { ChangeEvent, useEffect, useState } from 'react';
import { axiosInstance } from '../../services/axiosInstance';
import { motion } from 'framer-motion';
import list_icon from '/svg/task_list.svg';
import MyTaskCard from '../../components/shared/card/MyTaskCard';
import { SubtaskIncludes } from '../../types/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import SelectOptions from '../../components/shared/select/Select';

const spring = {
  type: 'spring',
  stiffness: 150,
  damping: 30,
};

type Options = { id: number; name: string };

const ListPersonalTask = () => {
  const [isOn, setIsOn] = useState(false);
  const { userSession } = useSelector((state: RootState) => state);
  const [specialities, setSpecialities] = useState<Options[] | null>(null);
  const [projects, setProjects] = useState<Options[]>();
  const { id } = userSession;
  const [subTask, setSubTask] = useState<SubtaskIncludes[] | null>(null);

  // useEffect(() => {
  //   axiosInstance.get(`/users/${id}/subTasks?project=52`).then(res => {
  //     setSubTask(res.data);
  //   });
  // }, [userSession]);

  const toggleSwitch = () => {
    setIsOn(!isOn);
  };

  useEffect(() => {
    specialitiesList();
  }, []);

  const specialitiesList = () => {
    return axiosInstance
      .get(`/specialities`)
      .then(res => setSpecialities(res.data));
  };

  const handleProjectsList = ({ target }: ChangeEvent<HTMLSelectElement>) => {
    const specialityId = target.value;
    return axiosInstance
      .get(`/specialities/${specialityId}`)
      .then(res => setProjects(res.data.projects));
  };

  const handleSubTaskList = ({ target }: ChangeEvent<HTMLSelectElement>) => {
    const projectId = target.value;
    return axiosInstance
      .get(`/users/${id}/subTasks?project=${projectId}`)
      .then(res => {
        setSubTask(res.data);
      });
  };
  return (
    <div className="my-container-list ">
      <div className="my-title-list">
        <div className="my-title-content">
          <img className="task-icon" src={list_icon} alt="task-list" />
          <h2>Mis tareas</h2>
        </div>
        {specialities && (
          <div className="my-project-list">
            <span>Especialidad: </span>
            <SelectOptions
              data={specialities}
              itemKey="id"
              textField="name"
              name="Speciality"
              onChange={e => handleProjectsList(e)}
              className="my-select-speciality"
            />
            <span>Proyecto: </span>
            <SelectOptions
              data={projects}
              itemKey="id"
              textField="name"
              name="projects"
              onChange={e => handleSubTaskList(e)}
              className="my-select-speciality"
            />
          </div>
        )}
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
                  <MyTaskCard subTask={subTask} />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default ListPersonalTask;
