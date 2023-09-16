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

const Project = () => {
  const { id } = useParams();
  const socket = useContext(SocketContext);
  const [levels, setlevels] = useState<Level | null>(null);
  const [hasProject, setHasProject] = useState(false);
  useEffect(() => {
    getLevels();
  }, [id]);
  useEffect(() => {
    socket.on('server:update-project', (Level: Level) => {
      console.log({ Level });
      if (id) setlevels(Level);
    });
    return () => {
      socket.off('server:update-project');
    };
  }, [socket]);
  const getLevels = () => {
    axiosInstance.get(`/stages/${id}`).then(res => {
      if (id) {
        socket.emit('join', `project-${id}`);
        const hasProject = findProject(res.data.nextLevel);
        setHasProject(hasProject);
        setlevels({ ...res.data, stagesId: +id });
      }
    });
  };

  return (
    <div className="project">
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
    </div>
  );
};

export default Project;
