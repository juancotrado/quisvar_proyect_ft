import { useParams } from 'react-router-dom';
import ProjectCard, {
  ProjectType,
} from '../../components/projects/projectCard/ProjectCard';
import './projects.css';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../services/axiosInstance';
import Button from '../../components/shared/button/Button';
import useRole from '../../hooks/useRole';

const Projects = () => {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const { id } = useParams();
  const { role } = useRole();

  useEffect(() => {
    axiosInstance
      .get(`workareas/${id}`)
      .then(res => {
        setProjects(res.data.project);
      })
      .catch(err => console.log(err));
  }, [id]);

  console.log(projects);

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
            onClick={() => {
              console.log('add');
            }}
          />
        )}
      </div>
      <div className="project-card-container">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
