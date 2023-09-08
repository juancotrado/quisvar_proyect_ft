import { useParams } from 'react-router-dom';
import './project.css';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../../services/axiosInstance';
import { Level } from '../../../types/types';
import ProjectLevel from '../../../components/project/projectLevel/ProjectLevel';

interface Stages {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  projectId: number;
}
interface DropdownLevel {
  level: Level;
}

const DropdownLevel = ({ level }: DropdownLevel) => {
  if (level.level === 10) return <div></div>;
  return (
    <div className="project-dropdown-content">
      <ul className="project-dropdown-sub">
        {level.nextLevel?.map(level1 => (
          <li key={level1.id} className="project-dropdown-sub-list">
            <ProjectLevel data={level1} />
            <DropdownLevel level={level1} />
          </li>
        ))}
      </ul>
    </div>
  );
};

const Project = () => {
  const { id } = useParams();
  const [stages, setStages] = useState<Stages[] | null>(null);
  // const [stage, setStage] = useState<Stage |null>(null)
  const [levels, setlevels] = useState<Level[] | null>(null);
  console.log(id);

  useEffect(() => {
    getStages();
  }, [id]);
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
            {i !== 0 && (
              <span className="project-header-separation" key={stage.id}>
                |
              </span>
            )}
            <span
              className="project-header-span"
              key={stage.id + 1}
              onClick={() => getStage(stage.id)}
            >
              {stage.name}
            </span>
          </>
        ))}
      </div>
      <div className="project-dropdown-content">
        <ul className="project-dropdown">
          {levels?.map(level => (
            <li key={level.id} className="project-dropdown-list">
              <ProjectLevel data={level} />
              <div className="project-dropdown-content">
                <ul className="project-dropdown-sub">
                  {level.nextLevel?.map(level1 => (
                    <li key={level1.id} className="project-dropdown-sub-list">
                      <ProjectLevel data={level1} />
                      <DropdownLevel level={level1} />
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Project;
