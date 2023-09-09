import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { axiosInstance } from '../../services/axiosInstance';
import './stage.css';
import { ProjectType } from '../../types/types';

interface Stages {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  projectId: number;
}
const Stage = () => {
  const { stageId } = useParams();
  const [project, setProject] = useState<ProjectType | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    console.log('stage', stageId);
    getStages();
  }, [stageId]);
  const getStages = () => {
    axiosInstance.get(`/projects/${stageId}`).then(res => setProject(res.data));
  };
  const handleStageNavigate = (id: number) => {
    navigate(`proyecto/${id}`);
  };
  return (
    <div className="stage">
      <div className="stage-header">
        {project?.stages?.map((stage, i) => (
          <>
            {i !== 0 && (
              <span className="stage-header-separation" key={stage.id}>
                |
              </span>
            )}
            <span
              className="stage-header-span"
              key={stage.id + 1}
              onClick={() => handleStageNavigate(stage.id)}
            >
              {stage.name}
            </span>
          </>
        ))}
      </div>
      <div className="stage-title-contain">
        <figure className="stage-figure">
          <img src="/svg/polygon.svg" alt="W3Schools" />
        </figure>
        <h4 className="stage-title">{project?.name}</h4>
      </div>
      <div className="stage-title-levels">
        <Outlet />
      </div>
    </div>
  );
};

export default Stage;
