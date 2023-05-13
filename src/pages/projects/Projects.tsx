import { useParams } from 'react-router-dom';
import ProjectCard from '../../components/projects/projectCard/ProjectCard';
import './projects.css';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../services/axiosInstance';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    axiosInstance
      .get(`workareas/${id}`)
      .then(res => {
        setProjects(res.data.project);
      })
      .catch(err => console.log(err));
  }, [id]);

  return (
    <div className="project container">
      <h1 className="main-title">
        LISTA DE <span className="main-title-span">PROYECTOS</span>
      </h1>
      <div className="project-card-container">
        {projects.map(project => (
          <ProjectCard project={project} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
