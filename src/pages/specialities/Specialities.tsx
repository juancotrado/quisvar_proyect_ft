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
  };

  const settingSectors = (sectors: SectorType[]) => {
    setSectors(sectors);
  };
  const addNewProject = () => {
    isOpenModal$.setSubject = true;
    setProject(null);
  };

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
