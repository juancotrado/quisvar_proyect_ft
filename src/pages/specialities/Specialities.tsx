import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { axiosInstance } from '../../services/axiosInstance';
import { ProjectType, SectorType } from '../../types/types';
import { useEffect, useState } from 'react';
import './specialities.css';
import { CardRegisterProject } from '../../components';
import Button from '../../components/shared/button/Button';
import { isOpenModal$ } from '../../services/sharingSubject';
// import ProjectGroup from '../../components/projects/ProjectGroup';
import SidebarSpeciality from '../../components/specialities/sidebarSpeciality/SidebarSpeciality';
import { Outlet, useNavigate } from 'react-router-dom';

const Specialities = () => {
  const navigate = useNavigate();
  const { userSession } = useSelector((state: RootState) => state);
  const [project, setProject] = useState<ProjectType | null>(null);
  // const [groupProject, setGroupProject] = useState<number>(0);
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
    navigate(`${id}`);
    // await axiosInstance.get(`typespecialities/${id}`).then(({ data }) => {
    //   setGroupProject(data.groups.length);
    // });
  };

  const settingSectors = (sectors: SectorType[]) => {
    setSectors(sectors);
  };
  const addNewProject = () => {
    isOpenModal$.setSubject = true;
    setProject(null);
  };

  // const editProject = (project: ProjectType) => {
  //   setProject(project);
  //   isOpenModal$.setSubject = true;
  // };

  // const getText = () => {
  //   if (groupProject === null)
  //     return 'Seleccione unas de las especialidades para ver los proyectos disponibles.';
  //   if (groupProject === 0) {
  //     return role === 'EMPLOYEE'
  //       ? 'Esta especialidad no tiene proyectos, elija otra especialidad.'
  //       : 'Esta especialidad no tiene proyectos, agregue un nuevo proyecto.';
  //   }
  // };

  return (
    <div className="speciality">
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
        {sectors && (
          <SidebarSpeciality
            sectors={sectors}
            getProjects={id => {
              navigate(`${id}`);
            }}
            onSave={getSpecialities}
            settingSectors={settingSectors}
          />
        )}
        <Outlet />
        {/* {groupProject ? (
        ) : (
          <div className="speciality-project-aditional">
            <p className="speciality-project-paragraph">{getText()}</p>
          </div>
        )} */}
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
