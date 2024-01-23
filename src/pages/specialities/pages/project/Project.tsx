import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import './project.css';
import { useEffect } from 'react';
import { PROJECT_OPTIONS } from './models';
import { axiosInstance } from '../../../../services/axiosInstance';
import { StageInfo } from '../../../../types';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { setModAuthProject } from '../../../../store/slices/modAuthProject.slice';

export const Project = () => {
  const navigation = useNavigate();
  const location = useLocation();
  const { stageId } = useParams();

  const { id } = useSelector((state: RootState) => state.userSession);
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    getStageDetails();
    const pathnameSplit = location.pathname.split('/');
    if (pathnameSplit.length === 6) navigation('presupuestos');
  }, [location.pathname, navigation]);

  const getStageDetails = () => {
    axiosInstance.get<StageInfo>(`/stages/details/${stageId}`).then(res => {
      const isModsAuthProject = res.data?.group?.moderator.id === id;
      dispatch(setModAuthProject(isModsAuthProject));
    });
  };
  return (
    <div className="project">
      <div className="project-options">
        {PROJECT_OPTIONS.map(option => (
          <div key={option.id}>
            <NavLink to={option.navigation}>
              {({ isActive }) => (
                <span
                  className={
                    isActive
                      ? 'project-header-btn  project-header-btn-selected'
                      : 'project-header-btn'
                  }
                >
                  <img
                    src={`svg/${isActive ? option.iconOn : option.iconOff}.svg`}
                    className="project-img-icon"
                  />
                  <span className="project-span-text">{option.text}</span>
                </span>
              )}
            </NavLink>
          </div>
        ))}
      </div>
      <div className="project-content">
        <Outlet />
      </div>
    </div>
  );
};
