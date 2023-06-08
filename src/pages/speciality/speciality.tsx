/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProjectType } from '../../types/types';
import { axiosInstance } from '../../services/axiosInstance';
import ProjectCard from '../../components/projects/projectCard/ProjectCard';
import Button from '../../components/shared/button/Button';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import './speciality.css';
import { CardRegisterProject } from '../../components';
import { isOpenModal$ } from '../../services/sharingSubject';

const Speciality = () => {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [name, setName] = useState<string | null>(null);
  const { userSession } = useSelector((state: RootState) => state);
  const role = userSession?.role ? userSession.role : 'EMPLOYEE';
  const [projectData, setProjectData] = useState<ProjectType | null>(null);
  const { id } = useParams();
  const specialityId = parseInt(id ? id : '');
  useEffect(() => {
    getProjects();
  }, []);

  const getProjects = async () => {
    await axiosInstance.get(`specialities/${id}`).then(res => {
      setProjects(res.data.projects);
      setName(res.data.name);
    });
  };

  const addNewProject = () => {
    isOpenModal$.setSubject = true;
    setProjectData(null);
  };

  const editProject = (data: ProjectType) => {
    isOpenModal$.setSubject = true;
    setProjectData(data);
  };

  const succefullyProject = () => {
    setProjectData(null);
    getProjects();
  };

  return (
    <div className="project container">
      <div className="project-head">
        <div>
          <h1 className="main-title">
            LISTA DE <span className="main-title-span">PROYECTOS </span>
          </h1>
          <span>{name}</span>
        </div>

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
            onClick={() => {
              editProject(project);
            }}
            onSave={succefullyProject}
          />
        ))}
      </div>
      <CardRegisterProject
        specialityId={specialityId}
        project={projectData}
        onSave={succefullyProject}
      />
    </div>
  );
};

export default Speciality;
