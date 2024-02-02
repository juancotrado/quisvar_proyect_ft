import { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { axiosInstance } from '../../../../services/axiosInstance';
import './stage.css';
import { ProjectType } from '../../../../types';
import { Button, LoaderForComponent } from '../../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { setModAuthProject } from '../../../../store/slices/modAuthProject.slice';
import { StageAddButton, StageItem } from './components';
import { useRole } from '../../../../hooks';

export const Stage = () => {
  const { projectId } = useParams();
  const dispatch: AppDispatch = useDispatch();
  const { modAuthProject } = useSelector((state: RootState) => state);
  const { hasAccess } = useRole('MOD');

  const { id } = useSelector((state: RootState) => state.userSession);

  const handleBtnActive = () => {
    setBtnActive(!btnActive);
  };
  const [project, setProject] = useState<ProjectType | null>(null);
  const [btnActive, setBtnActive] = useState<boolean>(false);
  useEffect(() => {
    if (id) {
      getStages();
    }
  }, [projectId, id]);

  const getStages = async () => {
    axiosInstance.get(`/projects/${projectId}`).then(res => {
      const isModsAuthProject = hasAccess || res.data?.moderator?.id === id;
      dispatch(setModAuthProject(isModsAuthProject));
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
            {modAuthProject && (
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
