import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { axiosInstance } from '../../services/axiosInstance';
import { ProjectType, SectorType } from '../../types/types';
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
  const [groupProject, setGroupProject] = useState<
    | {
        id: number;
        projects: ProjectType[];
      }[]
    | null
  >(null);
  const [specialityId, setSpecialityId] = useState<number | null>(null);
  const role = userSession?.role ? userSession.role : 'EMPLOYEE';
  const [sectors, setSectors] = useState<SectorType[] | null>(null);

  useEffect(() => {
    getSpecialities();
  }, []);

  const getSpecialities = async () => {
    await axiosInstance.get('/specialities').then(res => {
      setSectors(res.data);
    });
  };
  const getProjects = async (id: number) => {
    setSpecialityId(id);
    await axiosInstance.get(`specialities/${id}`).then(res => {
      setGroupProject(res.data.groups);
    });
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
        {role !== 'EMPLOYEE' && (
          <Button
            text="Agregar"
            icon="plus"
            className="btn-add"
            onClick={addNewProject}
          />
        )}
      </div>
      <div className="speciality-main">
        {/* <div className="speciality-card-container">
          {specialities &&
            specialities.map(_speciality => (
              <CardSpeciality
                key={_speciality.id}
                data={_speciality}
                onDelete={getSpecialities}
                onUpdate={getSpecialities}
                role={role}
                getProjects={getProjects}
                selected={selectedSpecialityId === _speciality.id}
                onSelect={() => handleSpecialitySelect(_speciality.id)}
              />
            ))}
          {role !== 'EMPLOYEE' && (
            <CardAddSpeciality onSave={getSpecialities} />
          )}
        </div> */}
        {groupProject && groupProject.length ? (
          <div className="speciality-project-container">
            {groupProject.map(group => (
              <ProjectGroup
                key={group.id}
                group={group.projects}
                editProject={editProject}
              />
              // <div key={group.id}>
              //   <span>{group.id}</span>
              //   {group.projects.map(project => (
              //     <ProjectCard
              //       key={project.id}
              //       project={project}
              //       editProject={editProject}
              //       onSave={getProjects}
              //     />
              //   ))}
              // </div>
            ))}
          </div>
        ) : (
          // <div className="speciality-project-container">
          //   {projects &&
          //     projects.map(project => (
          //       <ProjectCard
          //         key={project.id}
          //         project={project}
          //         editProject={editProject}
          //         onSave={getProjects}
          //       />
          //     ))}
          // </div>
          <div className="speciality-project-aditional">
            <p className="speciality-project-paragraph">{getText()}</p>
          </div>
        )}
      </div>
      {specialityId && (
        <CardRegisterProject
          specialityId={specialityId}
          project={project}
          onSave={getProjects}
        />
      )}
      {sectors && (
        <SidebarSpeciality sectors={sectors} getProjects={getProjects} />
      )}
    </div>
  );
};

export default Specialities;
