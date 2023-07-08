import { useNavigate } from 'react-router-dom';
import './projectCard.css';
import { motion } from 'framer-motion';
import Button from '../../shared/button/Button';
import { _date } from '../../../utils/formatDate';
import { ProjectType } from '../../../types/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useRef, useState } from 'react';
import { URL, axiosInstance } from '../../../services/axiosInstance';
import DropDownSelector from '../../shared/select/DropDownSelector';
import DotsOption from '../../shared/dots/DotsOption';
import Portal from '../../portal/Portal';
import { dropIn } from '../../../animations/animations';
import useArchiver from '../../../hooks/useArchiver';

type Option = {
  name: string;
  type: 'button' | 'submit' | 'reset' | undefined;
  icon: string;
  function: () => void;
};
interface ProjectCardProps {
  editProject: (value: ProjectType) => void;
  project: ProjectType;
  onSave?: (value: number) => void;
}

const ProjectCard = ({ project, editProject, onSave }: ProjectCardProps) => {
  const { userSession } = useSelector((state: RootState) => state);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const role = userSession?.role ? userSession.role : 'EMPLOYEE';
  const { profile } = project.moderator;
  const { handleArchiver } = useArchiver(project.id, 'projects');

  const navigate = useNavigate();

  // const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSave = () => {
    onSave?.(project.specialityId);
  };

  const handleEdit = () => {
    editProject(project);
  };

  const handleDuplicate = async (id: number) => {
    await axiosInstance
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
      <figure className="project-card-figure">
        <img src="/svg/project_icon.svg" alt="" />
      </figure>
      <div className="project-card-main">
        <div className="projec-card-header">
          <h3 className="project-card-subtitle">
            TIPO: {project.typeSpeciality}
          </h3>
          <div className="project-card-option">
            <p className="project-card-date">{`Fecha Límite: ${_date(
              project.untilDate
            )}`}</p>
            {role !== 'EMPLOYEE' && (
              <DotsOption data={optionsData} persist={true} />
            )}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h4 className="project-card-cordinator">
            COORDINADOR: {profile.firstName} {profile.lastName}
          </h4>
          <p className="project-card-description">
            CUI: {project.CUI ? project.CUI : '123456'}{' '}
            {project.name
              ? project.name
              : 'CREACION DEL SERVICIO DE PRÁCTICA DEPORTIVA Y/O RECREATIVA EN LA COMUNIDAD CAMPESINA DE KALAHUALA DISTRITO DE ASILLO DE LA PROVINCIA DE AZANGARO DEL DEPARTAMENTO DE PUNO.'}
          </p>
        </div>
        <div className="project-card-footer">
          {project.unique ? (
            <div className="project-card-footer-area">
              {project.areas.map(area => (
                <Button
                  key={area.id}
                  text="Ver más"
                  className="project-btn-footer"
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
      </div>
    </div>
  );
};

export default ProjectCard;
