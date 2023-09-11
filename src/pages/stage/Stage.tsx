import { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { axiosInstance } from '../../services/axiosInstance';
import './stage.css';
import { ProjectType } from '../../types/types';
import Button from '../../components/shared/button/Button';
import { StageAddButton, StageItem } from '../../components';
interface Stages {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  projectId: number;
}

const Stage = () => {
  const { stageId } = useParams();
  const handleBtnActive = () => {
    setBtnActive(!btnActive);
  };
  const [project, setProject] = useState<ProjectType | null>(null);
  const [btnActive, setBtnActive] = useState<boolean>(false);
  useEffect(() => {
    console.log(stageId);

    getStages();
  }, [stageId]);
  const getStages = () => {
    axiosInstance.get(`/projects/${stageId}`).then(res => setProject(res.data));
  };

  return (
    <div className="stage">
      <div className="stage-header">
        {project?.stages?.map((stage, i) => (
          <StageItem stage={stage} i={i} key={stage.id} />
        ))}

        {!btnActive ? (
          <Button
            icon="add"
            className="stage-header-add-btn"
            onClick={handleBtnActive}
          />
        ) : (
          <StageAddButton
            stageId={stageId}
            getStages={getStages}
            setBtnActive={handleBtnActive}
          />
        )}
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
