import { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { axiosInstance } from '../../services/axiosInstance';
import { GroupProject, ProjectType } from '../../types/types';
import ProjectGroup from '../../components/projects/ProjectGroup';
import { CardRegisterProject } from '../../components';
import { isOpenModal$ } from '../../services/sharingSubject';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import './projectList.css';
const ProjectsList = () => {
  const { id } = useParams();
  const [groupProject, setGroupProject] = useState<GroupProject[] | null>(null);
  const [project, setProject] = useState<ProjectType | null>(null);
  const [typeSpecialityId, setTypeSpecialityId] = useState(0);
  const { userSession } = useSelector((state: RootState) => state);
  const role = userSession?.role ? userSession.role : 'EMPLOYEE';

  useEffect(() => {
    id && getProjects(+id);
    id && setTypeSpecialityId(+id);
  }, [id]);

  const getProjects = async (id: number) => {
    await axiosInstance.get(`typespecialities/${id}`).then(res => {
      setGroupProject(res.data.groups);
    });
  };
  const editProject = (project: ProjectType) => {
    setProject(project);
    isOpenModal$.setSubject = true;
  };
  const getText = () => {
    if (groupProject === null)
      return 'Seleccione unas de las especialidades para ver los proyectos disponibles.';
    if (groupProject.length === 0) {
      return role === 'EMPLOYEE'
        ? 'Esta especialidad no tiene proyectos, elija otra especialidad.'
        : 'Esta especialidad no tiene proyectos, agregue un nuevo proyecto.';
    }
  };
  return (
    <div className="project-list-specialist">
      {groupProject?.length === 0 && (
        <div className="speciality-project-aditional">
          <p className="speciality-project-paragraph">{getText()}</p>
        </div>
      )}
      <div
        className={`project-list-specialist-container ${
          role === 'EMPLOYEE' ? 'user-employee' : 'user-moderator'
        }`}
      >
        {groupProject &&
          groupProject.map(group => (
            <ProjectGroup
              key={group.id}
              group={group.projects}
              editProject={editProject}
              onSave={() => getProjects(typeSpecialityId)}
            />
          ))}
      </div>
      <div className="project-list-detail-project">
        <Outlet />
      </div>
      {/* {id && (
        <CardRegisterProject
          typeSpecialityId={+id}
          project={project}
          onSave={getProjects}
        />
      )} */}
    </div>
  );
};

export default ProjectsList;
