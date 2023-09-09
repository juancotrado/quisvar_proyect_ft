import { useParams } from 'react-router-dom';
import './project.css';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../../services/axiosInstance';
import { Level } from '../../../types/types';
import ProjectLevel from '../../../components/project/projectLevel/ProjectLevel';
import ProjectAddLevel from '../../../components/project/projectAddLevel/ProjectAddLevel';
const DATA: Level = {
  id: 0,
  item: '',
  name: '',
  rootId: 0,
  level: 0,
  spending: 0,
  balance: 0,
  price: 0,
  details: {
    UNRESOLVED: 0,
    PROCESS: 0,
    INREVIEW: 0,
    DENIED: 0,
    DONE: 0,
    LIQUIDATION: 0,
    TOTAL: 0,
  },
  stagesId: 0,
  subTasks: [],
};

interface DropdownLevel {
  level: Level;
  onSave?: () => void;
}

const DropdownLevel = ({ level, onSave }: DropdownLevel) => {
  if (level.level === 10) return <div></div>;
  return (
    <div className="project-dropdown-content">
      <ul className="project-dropdown-sub">
        {level.nextLevel?.map(level1 => (
          <>
            <li key={level1.id} className="project-dropdown-sub-list">
              <ProjectLevel data={level1} onSave={onSave} />
              <DropdownLevel level={level1} onSave={onSave} />
            </li>
          </>
        ))}
        <ProjectAddLevel data={level} onSave={onSave} />
      </ul>
    </div>
  );
};

const Project = () => {
  const { id } = useParams();
  const [levels, setlevels] = useState<Level[] | null>(null);

  useEffect(() => {
    getLevels();
  }, [id]);

  const getLevels = () => {
    axiosInstance.get(`/stages/${id}`).then(res => setlevels(res.data));
  };

  const getData = (): Level => {
    if (!id) return DATA;
    return { ...DATA, stagesId: +id };
  };
  const data = getData();
  return (
    <div className="project">
      <div className="project-dropdown-content">
        <ul className="project-dropdown">
          {levels?.map(level => (
            <li key={level.id} className="project-dropdown-list">
              <ProjectLevel data={level} onSave={getLevels} />
              <DropdownLevel level={level} onSave={getLevels} />
            </li>
          ))}
          <ProjectAddLevel data={data} onSave={getLevels} />
        </ul>
      </div>
    </div>
  );
};

export default Project;
