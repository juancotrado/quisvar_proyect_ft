import { Outlet, useParams } from 'react-router-dom';
import './project.css';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../../services/axiosInstance';
import { Level } from '../../../types/types';
import MoreInfo from '../../../components/project/moreInfo/MoreInfo';
import DropdownLevel from '../../../components/project/dropdownLevel/DropdownLevel';

const Project = () => {
  const { id } = useParams();
  const [levels, setlevels] = useState<Level | null>(null);

  useEffect(() => {
    getLevels();
  }, [id]);

  const getLevels = () => {
    axiosInstance.get(`/stages/${id}`).then(res => setlevels(res.data));
  };

  return (
    <div className="project">
      <div className="project-title-contain">
        <div className="project-contain-left">
          <figure className="project-figure">
            <img src="/svg/engineering.svg" alt="W3Schools" />
          </figure>
          <h4 className="project-title">{levels?.name}</h4>
        </div>
        {levels && (
          <div className="project-contain-right">
            <MoreInfo data={levels} />
          </div>
        )}
      </div>
      <div className="project-contain">
        {levels && <DropdownLevel level={levels} onSave={getLevels} />}
      </div>
      <Outlet />
    </div>
  );
};

export default Project;
