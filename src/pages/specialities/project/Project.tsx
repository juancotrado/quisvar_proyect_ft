import { useParams } from 'react-router-dom';
import './project.css';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../../services/axiosInstance';
import { Levels, Stage } from '../../../types/types';

interface Stages {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  projectId: number;
}

const Project = () => {
  const { id } = useParams();
  const [stages, setStages] = useState<Stages[] | null>(null);
  // const [stage, setStage] = useState<Stage |null>(null)
  const [levels, setlevels] = useState<Levels[] | null>(null);
  console.log(id);

  useEffect(() => {
    getStages();
  }, []);
  const getStages = () => {
    axiosInstance
      .get(`/projects/${id}`)
      .then(res => setStages(res.data.stages));
  };

  const getStage = (id: number) => {
    axiosInstance.get(`/stages/${id}`).then(res => setlevels(res.data));
  };

  return (
    <div className="project">
      <div className="project-header">
        {stages?.map((stage, i) => (
          <>
            {i !== 0 && <span className="project-header-separation"> |</span>}
            <span
              className="project-header-span"
              onClick={() => getStage(stage.id)}
            >
              {stage.name}
            </span>
          </>
        ))}
      </div>
      <div className="project-dropdown-content">
        <ul className="project-dropdown-sub">
          {levels?.map(level => (
            <li className="sidebarSpeciality-dropdown-sub-list">
              {level.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Project;
