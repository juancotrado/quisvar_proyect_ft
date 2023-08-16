import { useNavigate } from 'react-router-dom';
import './projectCard.css';
import { motion } from 'framer-motion';
import Button from '../../shared/button/Button';
// import { _date } from '../../../utils/formatDate';
import { Option, ProjectType } from '../../../types/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useState } from 'react';
import { axiosInstance } from '../../../services/axiosInstance';
import DropDownSelector from '../../shared/select/DropDownSelector';
import DotsOption from '../../shared/dots/DotsOption';
import Portal from '../../portal/Portal';
import { dropIn } from '../../../animations/animations';
import useArchiver from '../../../hooks/useArchiver';
import ProjectDetails from '../projectDetails/ProjectDetails';

interface ProjectCardProps {
  editProject: (value: ProjectType) => void;
  project: ProjectType;
  onSave?: (value: number) => void;
}

const ProjectCard = ({ project, editProject, onSave }: ProjectCardProps) => {
  const { userSession } = useSelector((state: RootState) => state);
  const [projectId, setProjectId] = useState<number | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const role = userSession?.role ? userSession.role : 'EMPLOYEE';
  const { handleArchiver } = useArchiver(project.id, 'projects');

  const navigate = useNavigate();

  // const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSave = () => {
    onSave?.(project.specialityId);
  };

  const handleEdit = () => {
    editProject(project);
  };

  const handleDuplicate = (id: number) => {
    axiosInstance
      .post(`/duplicates/project/${id}`)
      .then(() => onSave?.(project.specialityId));
  };

  const optionsData: Option[] = [
    {
      name: 'Editar',
      type: 'button',
      icon: 'pencil',
      function: handleEdit,
    },
    {
      name: 'Duplicar',
      type: 'button',
      icon: 'duplicate',
      function: () => handleDuplicate(project.id),
    },
    {
      name: 'Comprimir',
      type: 'button',
      icon: 'file-zipper',
      function: handleArchiver,
    },
    {
      name: 'Eliminar',
      type: 'button',
      icon: 'trash-red',
      function: () => setIsAlertOpen(true),
    },
  ];
  const handleDelete = async (id: number) => {
    await axiosInstance
      .delete(`/projects/${id}`)
      .then(() => onSave?.(project.specialityId));
  };

  const handleCloseButton = () => {
    setIsAlertOpen(!isAlertOpen);
  };
  const handleSendDelete = async () => {
    handleDelete(project.id);
    setIsAlertOpen(false);
    return;
  };
  return (
    <div className="project-card">
      <div className="project-card-info-main">
        <figure className="project-card-figure">
          <img src="/svg/project_icon.svg" alt="project_icon" />
        </figure>
        <div>
          <p className="project-card-description">
            CUI: {project.CUI ? project.CUI : '123456'}
          </p>
          <h3 className="project-card-cordinator">Nombre: {project.name}</h3>
        </div>
      </div>
      <div className="project-card-date">
        <p className="project-card-cordinator">
          <b>Descripción:</b> {project.description}
        </p>
        <p>
          <b>Ubicacion:</b> {project.department} / {project.province} /{' '}
          {project.district}
        </p>
        {projectId ? (
          <button
            className="projec-card-see-more"
            type="button"
            onClick={() => setProjectId(null)}
          >
            Ver menos
          </button>
        ) : (
          <button
            className="projec-card-see-more"
            type="button"
            onClick={() => setProjectId(project.id)}
          >
            Ver más detalles
          </button>
        )}
      </div>
      <div className="project-card-footer-option">
        <div className="project-card-footer">
          {project.unique ? (
            <div className="project-card-footer-area">
              {project.areas.map(area => (
                <Button
                  key={area.id}
                  text="Ver única Área"
                  className="project-btn-view"
                  onClick={() => navigate(`/tareas/${area.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="project-card-footer-area">
              <DropDownSelector
                data={project.areas}
                itemKey="id"
                textField="name"
                label="Seleccionar Area"
                post="workareas"
                navigateRoute="tareas"
                valuesQuery={{
                  projectId: project.id,
                }}
                onSave={handleSave}
              />
            </div>
          )}
          {isAlertOpen && (
            <Portal wrapperId="modal">
              <div
                className="alert-modal-main"
                role="dialog"
                onClick={handleCloseButton}
              >
                <motion.div
                  className="alert-modal-children"
                  variants={dropIn}
                  onClick={e => e.stopPropagation()}
                  initial="hidden"
                  animate="visible"
                  exit="leave"
                >
                  <img src="/svg/trashdark.svg" />
                  <h3>{`¿Estas seguro que deseas eliminar este registro?`}</h3>
                  <div className="container-btn">
                    <Button
                      text="No, cancelar"
                      onClick={handleCloseButton}
                      className="btn-alert "
                    />
                    <Button
                      className=" btn-alert  btn-delete"
                      text="Si, estoy seguro"
                      type="button"
                      onClick={handleSendDelete}
                    />
                  </div>
                </motion.div>
              </div>
            </Portal>
          )}
        </div>
        <div className="project-card-option">
          {role !== 'EMPLOYEE' && (
            <DotsOption data={optionsData} persist={true} />
          )}
        </div>
      </div>
      {projectId && <ProjectDetails projectId={projectId} />}
    </div>
  );
};

export default ProjectCard;
