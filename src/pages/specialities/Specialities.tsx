import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { axiosInstance } from '../../services/axiosInstance';
import { ProjectType, SpecialityType } from '../../types/types';
import { useEffect, useState } from 'react';
import CardSpeciality from '../../components/speciality/cardSpeciality/CardSpeciality';
import CardAddSpeciality from '../../components/speciality/cardAddSpeality/CardAddSpeciality';
import './specialities.css';
import { CardRegisterProject } from '../../components';
import Button from '../../components/shared/button/Button';
import { isOpenModal$ } from '../../services/sharingSubject';
import ProjectGroup from '../../components/projects/ProjectGroup';

const Specialities = () => {
  const { userSession } = useSelector((state: RootState) => state);
  const [projects, setProjects] = useState<ProjectType[] | null>(null);
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
  const [specialities, setSpecialities] = useState<SpecialityType[] | null>(
    null
  );
  const [selectedSpecialityId, setSelectedSpecialityId] = useState<
    number | null
  >(null);
  useEffect(() => {
    getSpecialities();
  }, []);

  const getSpecialities = async () => {
    await axiosInstance
      .get('/specialities')
      .then(res => setSpecialities(res.data));
  };
  const getProjects = async (id: number) => {
    setSpecialityId(id);
    await axiosInstance.get(`specialities/${id}`).then(res => {
      setGroupProject(res.data.groups);
      // setProjects(res.data.projects);
    });
  };

  // const patito = groupProject?.map(group => group.projects.map(p => p.stage));
  // console.log(patito);
  const addNewProject = () => {
    isOpenModal$.setSubject = true;
    setProject(null);
  };
  const editProject = (project: ProjectType) => {
    setProject(project);
    isOpenModal$.setSubject = true;
  };
  const getText = () => {
    if (projects === null)
      return 'Seleccione unas de las especialidades para ver los proyectos disponibles.';
    if (projects.length === 0) {
      return role === 'EMPLOYEE'
        ? 'Esta especialidad no tiene proyectos, elija otra especialidad.'
        : 'Esta especialidad no tiene proyectos, agregue un nuevo proyecto.';
    }
  };
  const handleSpecialitySelect = (specialityId: number) => {
    if (specialityId === selectedSpecialityId) {
      setSelectedSpecialityId(null);
    } else {
      setSelectedSpecialityId(specialityId);
    }
  };
  return (
    <div className="speciality container">
      <div className="speciality-head">
        <h1 className="speciality-title">
          <span className="speciality-title-span">ESPECIALIDADES</span>
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
        <div className="speciality-card-container">
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
        </div>
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
    </div>
  );
};

export default Specialities;
