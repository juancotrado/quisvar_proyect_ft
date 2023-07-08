import { useNavigate } from 'react-router-dom';
import './projectCard.css';
import ButtonDelete from '../../shared/button/ButtonDelete';
import Button from '../../shared/button/Button';
import { _date } from '../../../utils/formatDate';
import { ProjectType } from '../../../types/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useRef, useState } from 'react';
import { URL, axiosInstance } from '../../../services/axiosInstance';
import DropDownSelector from '../../shared/select/DropDownSelector';
import DotsOption from '../../shared/dots/DotsOption';

interface ProjectCardProps {
  editProject: (value: ProjectType) => void;
  project: ProjectType;
  onSave?: (value: number) => void;
}

const ProjectCard = ({ project, editProject, onSave }: ProjectCardProps) => {
  const { userSession } = useSelector((state: RootState) => state);
  const role = userSession?.role ? userSession.role : 'EMPLOYEE';
  const { profile } = project.moderator;
  const [openEditData, setOpenEditData] = useState<boolean>(false);
  // const { handleSubmit, register, reset, setValue } = useForm<AreaForm>();
  const navigate = useNavigate();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // const onSubmitArea: SubmitHandler<AreaForm> = values => {
  //   axiosInstance.post('/workareas', values).then(() => {
  //     handleSave();
  //     setAddArea(false);
  //   });
  // };

  const handleSave = () => {
    onSave?.(project.specialityId);
  };

  const handleEdit = () => {
    editProject(project);
  };

  const handleArchiver = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    const body = {
      projectName: project.name,
    };
    axiosInstance.post('/projects/archiver', body).then(res => {
      window.location.href = `${URL}/static/${res.data.url}`;
      timeoutRef.current = setTimeout(() => {
        axiosInstance
          .delete(`/projects/archiver/?projectName=${project.name}`)
          .then(res => {
            console.log(res.data);
          });
      }, 3000);
    });
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
            <DotsOption
              data={[
                {
                  name: openEditData ? 'Cancelar' : 'Editar',
                  type: openEditData ? 'submit' : 'button',
                  icon: openEditData ? 'close' : 'pencil',
                  function: () => {
                    setOpenEditData(!openEditData);
                  },
                },
                {
                  name: openEditData ? 'Guardar' : 'Eliminar',
                  type: openEditData ? 'submit' : 'button',
                  icon: openEditData ? 'save' : 'trash-red',
                  function: () => {
                    setOpenEditData(!openEditData);
                  },
                },
                {
                  name: 'Comprimir',
                  type: 'button',
                  icon: 'file-zipper',
                },
              ]}
            />
            {/* {role !== 'EMPLOYEE' && (
              <>
                {project.unique && (
                  <ButtonDelete
                    icon="trash"
                    url={`/projects/${project.id}`}
                    className="project-delete-icon"
                    onSave={handleSave}
                    imageStyle="project-size-img"
                  />
                )}
                {project.areas.length === 0 && (
                  <ButtonDelete
                    icon="trash"
                    url={`/projects/${project.id}`}
                    className="project-delete-icon"
                    onSave={handleSave}
                    imageStyle="project-size-img"
                  />
                )}
                <Button
                  icon="pencil"
                  className="project-edit-icon"
                  imageStyle="project-size-img"
                  onClick={handleEdit}
                />
              </>
            )} */}
          </div>
        </div>
        <h4 className="project-card-cordinator">
          COORDINADOR: {profile.firstName} {profile.lastName}
        </h4>
        <p className="project-card-description">
          CUI: {project.CUI ? project.CUI : '123456'}{' '}
          {project.name
            ? project.name
            : 'CREACION DEL SERVICIO DE PRÁCTICA DEPORTIVA Y/O RECREATIVA EN LA COMUNIDAD CAMPESINA DE KALAHUALA DISTRITO DE ASILLO DE LA PROVINCIA DE AZANGARO DEL DEPARTAMENTO DE PUNO.'}
        </p>
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
          <div className="project-card-footer-archiver">
            <Button
              text={'comprimir'}
              className="project-btn-footer"
              onClick={handleArchiver}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
