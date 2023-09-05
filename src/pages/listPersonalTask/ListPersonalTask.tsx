import './listpersonalTask.css';
import { ChangeEvent, useEffect, useState } from 'react';
import { axiosInstance } from '../../services/axiosInstance';
import { motion } from 'framer-motion';
import list_icon from '/svg/task_list.svg';
import MyTaskCard from '../../components/shared/card/myTaskCard/MyTaskCard';
import { SubtaskIncludes } from '../../types/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import SelectOptions from '../../components/shared/select/Select';
import Button from '../../components/shared/button/Button';
import { CardGenerateReport } from '../../components';
import { isOpenCardGenerateReport$ } from '../../services/sharingSubject';

const spring = {
  type: 'spring',
  stiffness: 150,
  damping: 30,
};

type Options = { id: number; name: string };

const ListPersonalTask = () => {
  const [isOn, setIsOn] = useState(false);
  const { userSession } = useSelector((state: RootState) => state);
  const [specialities] = useState<Options[] | null>(null);
  const [projects, setProjects] = useState<Options[]>();
  const { id } = userSession;
  const [subTask, setSubTask] = useState<SubtaskIncludes[] | null>(null);

  useEffect(() => {
    if (id)
      axiosInstance.get(`/users/${id}/subTasks`).then(res => {
        setSubTask(res.data);
        specialitiesList();
      });
  }, [userSession, id]);

  const toggleSwitch = () => {
    setIsOn(!isOn);
  };

  const specialitiesList = async () => {
    return await axiosInstance;
    // .get(`/specialities`)
    // .then(res => setSpecialities(res.data));
  };

  const handleProjectsList = async ({
    target,
  }: ChangeEvent<HTMLSelectElement>) => {
    const specialityId = target.value;
    const res = await axiosInstance.get(`/specialities/${specialityId}`);
    return setProjects(res.data.projects);
  };

  const handleSubTaskList = async ({
    target,
  }: ChangeEvent<HTMLSelectElement>) => {
    const projectId = target.value;
    return await axiosInstance
      .get(`/users/${id}/subTasks?project=${projectId}`)
      .then(res => {
        setSubTask(res.data);
      });
  };

  const showModal = () => {
    isOpenCardGenerateReport$.setSubject = true;
  };
  return (
    <div className="my-container-list ">
      <div className="my-title-list">
        <div className="my-title-content">
          <div className="my-title-apart">
            <img className="task-icon" src={list_icon} alt="task-list" />
            <h2>Mis tareas</h2>
          </div>
          <div className="generate-report">
            {isOn && <Button onClick={showModal} text="Generar Reporte" />}
          </div>
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

      <CardGenerateReport />
    </div>
  );
};

export default ListPersonalTask;
