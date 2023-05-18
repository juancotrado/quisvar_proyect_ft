import { useNavigate } from 'react-router-dom';
import './projectCard.css';
import useRole from '../../../hooks/useRole';
import ButtonDelete from '../../shared/button/ButtonDelete';
import Button from '../../shared/button/Button';
import { _date } from '../../../utils/formatDate';

export type ProjectType = {
  id: number;
  description?: string;
  name: string;
  price: number;
  status: boolean;
  startDate: Date;
  untilDate: Date;
  moderator: {
    profile: {
      firstName: string;
      lastName: string;
      phone?: string;
      userId: number;
    };
  };
};

interface ProjectCardProps {
  onClick?: () => void;
  project: ProjectType;
  onSave?: () => void;
}

const ProjectCard = ({ project, onClick, onSave }: ProjectCardProps) => {
  const navigate = useNavigate();
  const { role } = useRole();
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
          <div className="project-card-option">
            <p className="project-card-date">{`Fecha Límite: ${_date(
              project.untilDate
            )}`}</p>
            {role !== 'EMPLOYEE' && (
              <>
                <ButtonDelete
                  icon="trash"
                  url={`/projects/${project.id}`}
                  className="project-delete-icon"
                  onSave={onSave}
                />
                <Button
                  icon="pencil"
                  className="project-edit-icon"
                  onClick={onClick}
                />
              </>
            )}
          </div>
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
