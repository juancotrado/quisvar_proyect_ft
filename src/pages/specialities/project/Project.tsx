import { Outlet, useParams } from 'react-router-dom';
import './project.css';
import { useContext, useEffect, useState } from 'react';
import { axiosInstance } from '../../../services/axiosInstance';
import { Level } from '../../../types/types';
import MoreInfo from '../../../components/project/moreInfo/MoreInfo';
import DropdownLevel from '../../../components/project/dropdownLevel/DropdownLevel';
import CardRegisterSubTask from '../../../components/shared/card/cardRegisterSubTask/CardRegisterSubTask';
import { SocketContext } from '../../../context/SocketContex';
import { findProject } from '../../../utils/tools';
import { motion } from 'framer-motion';
import Button from '../../../components/shared/button/Button';
import { GeneralData } from '../../../components';

const Project = () => {
  const { stageId } = useParams();
  const socket = useContext(SocketContext);
  const [levels, setlevels] = useState<Level | null>(null);
  const [hasProject, setHasProject] = useState(false);
  const [optionSelected, setOptionSelected] = useState(1);
  useEffect(() => {
    getLevels();
  }, [stageId]);
  useEffect(() => {
    socket.on('server:update-project', (Level: Level) => {
      if (stageId) setlevels(Level);
    });
    return () => {
      socket.off('server:update-project');
    };
  }, [socket]);
  const getLevels = () => {
    axiosInstance.get(`/stages/${stageId}`).then(res => {
      if (stageId) {
        socket.emit('join', `project-${stageId}`);
        const hasProject = findProject(res.data.nextLevel);
        setHasProject(hasProject);
        setlevels({ ...res.data, stagesId: +stageId });
      }
    });
  };

  const projectOptions = [
    {
      id: 1,
      text: 'DATOS GENERALES',
      iconOn: 'ntbook-blue',
      iconOff: 'ntbook-black',
    },
    {
      id: 2,
      text: 'HOJA DE PRESUPUESTOS',
      iconOn: 'spread-blue',
      iconOff: 'spread-black',
    },
    { id: 3, text: 'BÁSICOS', iconOn: 'brief-blue', iconOff: 'brief-black' },
  ];
  return (
    <div className="project">
      <div className="project-options">
        {projectOptions.map(option => (
          <Button
            onClick={() => setOptionSelected(option.id)}
            className={`project-header-btn ${
              optionSelected === option.id && 'project-header-btn-selected'
            }`}
            text={option.text}
            icon={`${
              optionSelected === option.id ? option.iconOn : option.iconOff
            }`}
            imageStyle="project-img-size"
          />
        ))}
      </div>
      <div className="project-content">
        {optionSelected === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%' }}
          >
            <GeneralData />
          </motion.div>
        )}
        {optionSelected === 2 && (
          <>
            <div className="project-title-contain">
              <div className="project-contain-left">
                <figure className="project-figure">
                  <img src="/svg/engineering.svg" alt="W3Schools" />
                </figure>
                <h4 className="project-title">{levels?.projectName}</h4>
              </div>
              {levels && (
                <div className="project-contain-right">
                  <MoreInfo data={levels} />
                </div>
              )}
            </div>
            <div className="project-contain">
              {levels && (
                <DropdownLevel
                  level={levels}
                  onSave={getLevels}
                  hasProject={hasProject}
                />
              )}
            </div>
            <Outlet />

            <CardRegisterSubTask onSave={getLevels} />
          </>
        )}
        {optionSelected === 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%' }}
          >
            hola 3
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Project;
