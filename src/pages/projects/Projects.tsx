import { useParams } from 'react-router-dom';
import './projects.css';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../services/axiosInstance';
import Button from '../../components/shared/button/Button';
import useRole from '../../hooks/useRole';
import { CardRegisterProject } from '../../components';
import { isOpenModal$ } from '../../services/sharingSubject';
import ProjectCard, {
  ProjectType,
} from '../../components/projects/projectCard/ProjectCard';
import { ProjectForm } from '../../components/shared/card/cardRegisterProject/CardRegisterProject';

const Projects = () => {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [projectData, setProjectData] = useState<ProjectForm | null>(null);
  const { id } = useParams();
  const { role } = useRole();

  useEffect(() => {
    getProjects(id);
  }, [id]);

  const getProjects = async (id: string | undefined) => {
    await axiosInstance
      .get(`workareas/${id}`)
      .then(res => {
        setProjects(res.data.project);
      })
      .catch(err => console.log(err));
  };

  const addNewProject = () => {
    isOpenModal$.setSubject = true;
    setProjectData(null);
  };

  const editProject = (data: ProjectType) => {
    isOpenModal$.setSubject = true;
    const { moderator, ...project } = data;
    setProjectData({
      ...project,
      workAreaId: data.id,
      userId: moderator.profile.userId,
      status: data.status,
    });
  };

  return (
    <div className="project container">
      <div className="project-head">
        <h1 className="main-title">
          LISTA DE <span className="main-title-span">PROYECTOS</span>
        </h1>
        {role !== 'EMPLOYEE' && (
          <Button
            text="Agregar"
            icon="plus"
            className="btn-add"
            onClick={addNewProject}
          />
        )}
      </div>
      <div className="project-card-container">
        {projects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => editProject(project)}
            onSave={() => getProjects(id)}
          />
        ))}
      </div>
      <CardRegisterProject
        dataProject={projectData}
        areaId={id ? id : ''}
        onSave={() => {
          getProjects(id);
          setProjectData(null);
        }}
      />
    </div>
  );
};

export default Projects;
