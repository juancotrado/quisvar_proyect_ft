import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { axiosInstance } from '../../services/axiosInstance';
import { GroupProject, ProjectType, SectorType } from '../../types/types';
import { useEffect, useState } from 'react';
import './specialities.css';
import { CardRegisterProject } from '../../components';
import Button from '../../components/shared/button/Button';
import { isOpenModal$ } from '../../services/sharingSubject';
import ProjectGroup from '../../components/projects/ProjectGroup';
import SidebarSpeciality from '../../components/specialities/sidebarSpeciality/SidebarSpeciality';

const Specialities = () => {
  const { userSession } = useSelector((state: RootState) => state);
  const [project, setProject] = useState<ProjectType | null>(null);
  const [groupProject, setGroupProject] = useState<GroupProject[] | null>(null);
  const [typeSpecialityId, setTypeSpecialityId] = useState<number | null>(null);
  const role = userSession?.role ? userSession.role : 'EMPLOYEE';
  const [sectors, setSectors] = useState<SectorType[] | null>(null);

  useEffect(() => {
    getSpecialities();
  }, []);

  const getSpecialities = async () => {
    const response = await axiosInstance.get('/sector');
    setSectors(response.data);
  };
  const getProjects = async (id: number) => {
    setTypeSpecialityId(id);
    await axiosInstance.get(`typespecialities/${id}`).then(res => {
      setGroupProject(res.data.groups);
    });
  };

  const settingSectors = (sectors: SectorType[]) => {
    setSectors(sectors);
  };
  const addNewProject = () => {
    isOpenModal$.setSubject = true;
    setProject(null);
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
    <div className="speciality container">
      <div className="speciality-head">
        <h1 className="speciality-title">
          <span className="speciality-title-span">PROYECTOS</span>
        </h1>
        {role !== 'EMPLOYEE' && groupProject && (
          <Button
            text="Agregar"
            icon="plus"
            className="btn-add"
            onClick={addNewProject}
          />
        )}
      </div>
      <div className="speciality-main">
        {sectors && (
          <SidebarSpeciality
            sectors={sectors}
            getProjects={getProjects}
            onSave={getSpecialities}
            settingSectors={settingSectors}
          />
        )}
        {groupProject && groupProject.length ? (
          <div className="speciality-project-container">
            {typeSpecialityId &&
              groupProject.map(group => (
                <ProjectGroup
                  key={group.id}
                  group={group.projects}
                  editProject={editProject}
                  onSave={() => getProjects(typeSpecialityId)}
                />
              ))}
          </div>
        ) : (
          <div className="speciality-project-aditional">
            <p className="speciality-project-paragraph">{getText()}</p>
          </div>
        )}
      </div>
      {typeSpecialityId && (
        <CardRegisterProject
          typeSpecialityId={typeSpecialityId}
          project={project}
          onSave={getProjects}
        />
      )}
    </div>
  );
};

export default Specialities;
