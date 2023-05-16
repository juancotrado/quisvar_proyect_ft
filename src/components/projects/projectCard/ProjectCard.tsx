import { useNavigate } from 'react-router-dom';
import './projectCard.css';

const ProjectCard = ({ project }: any) => {
  const navigate = useNavigate();
  const handleNext = () => {
    navigate(`/tareas/${project.id}`);
  };
  return (
    <div className="project-card">
      <figure className="project-card-figure">
        <img src="/svg/project_icon.svg" alt="" />
      </figure>
      <div className="project-card-main">
        <div className="projec-card-header">
          <h3 className="project-card-subtitle">{project.name}</h3>
          <p className="project-card-date">Fecha Limite: {project.untilDate}</p>
        </div>
        <h4 className="project-card-cordinator">
          COORDINADOR: {project.moderator.profile.firstName}{' '}
          {project.moderator.profile.lastName}
        </h4>
        <p className="project-card-description">
          {project.description
            ? project.description
            : 'CREACION DEL SERVICIO DE PRÁCTICA DEPORTIVA Y/O RECREATIVA EN LA COMUNIDAD CAMPESINA DE KALAHUALA DISTRITO DE ASILLO DE LA PROVINCIA DE AZANGARO DEL DEPARTAMENTO DE PUNO.'}
        </p>
        <div className="project-card-footer">
          <p className="project-card-task">TOTAL DE TAREAS: 1</p>
          <p className="project-card-show" onClick={handleNext}>
            VER MAS
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
