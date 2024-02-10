import { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { axiosInstance } from '../../../../services/axiosInstance';
import './stage.css';
import { ProjectType } from '../../../../types';
import { Button, LoaderForComponent } from '../../../../components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { StageAddButton, StageItem } from './components';
import { useRole } from '../../../../hooks';

export const Stage = () => {
  const [project, setProject] = useState<ProjectType | null>(null);
  const [btnActive, setBtnActive] = useState<boolean>(false);
  const { projectId } = useParams();
  const { hasAccess } = useRole('MOD');
  const { id } = useSelector((state: RootState) => state.userSession);

  const handleBtnActive = () => {
    setBtnActive(!btnActive);
  };
  useEffect(() => {
    if (id) {
      getStages();
    }
  }, [projectId, id]);

  const getStages = () => {
    axiosInstance.get(`/projects/${projectId}`).then(res => {
      setProject(res.data);
    });
  };

  return (
    <div className="stage">
      <div className="stage-header">
        {project ? (
          <>
            {project?.stages?.map((stage, i) => (
              <StageItem
                stage={stage}
                i={i}
                key={stage.id}
                getStages={getStages}
              />
            ))}
            {hasAccess && (
              <>
                {!btnActive ? (
                  <Button
                    icon="add"
                    className="stage-header-add-btn"
                    onClick={handleBtnActive}
                  />
                ) : (
                  <StageAddButton
                    stageId={projectId}
                    getStages={getStages}
                    setBtnActive={handleBtnActive}
                  />
                )}
              </>
            )}
          </>
        ) : (
          <LoaderForComponent width={20} />
        )}
      </div>

      <Outlet />
    </div>
  );
};
