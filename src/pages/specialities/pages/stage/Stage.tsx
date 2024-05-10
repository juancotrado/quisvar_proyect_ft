import { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { axiosInstance } from '../../../../services/axiosInstance';
import './stage.css';
import { ProjectType } from '../../../../types';
import { Button, LoaderForComponent } from '../../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { StageAddButton, StageItem } from './components';
import { useRole } from '../../../../hooks';
import { setModAuthProject } from '../../../../store/slices/modAuthProject.slice';

export const Stage = () => {
  const [project, setProject] = useState<ProjectType | null>(null);
  const [btnActive, setBtnActive] = useState<boolean>(false);
  const { projectId } = useParams();
  const { hasAccess } = useRole('MOD');
  const { id } = useSelector((state: RootState) => state.userSession);
  const dispatch: AppDispatch = useDispatch();

  const handleBtnActive = () => {
    setBtnActive(!btnActive);
  };
  useEffect(() => {
    if (id) {
      getStages();
    }
    return () => {
      setProject(null);
    };
  }, [projectId, id]);

  const getStages = () => {
    axiosInstance
      .get<ProjectType>(`/projects/${projectId}`, {
        headers: { noLoader: true },
      })
      .then(res => {
        const isModsAuthProject = res.data.hasAccessInStage || hasAccess;
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
            {(hasAccess || project.hasAccessInStage) && (
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
