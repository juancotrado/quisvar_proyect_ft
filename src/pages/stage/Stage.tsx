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
    getStages();
  }, [stageId]);
  const getStages = () => {
    console.log('asd');

    axiosInstance.get(`/projects/${stageId}`).then(res => setProject(res.data));
  };

  return (
    <div className="stage">
      <div className="stage-header">
        {project?.stages?.map((stage, i) => (
          <StageItem stage={stage} i={i} key={stage.id} getStages={getStages} />
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

      <Outlet />
    </div>
  );
};

export default Stage;
