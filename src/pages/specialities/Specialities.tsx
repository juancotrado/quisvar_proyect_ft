import { axiosInstance } from '../../services/axiosInstance';
import { useEffect, useState } from 'react';
import './specialities.css';
import { CardRegisterProject } from '../../components';
// import ProjectGroup from '../../components/projects/ProjectGroup';
import SidebarSpeciality from '../../components/specialities/sidebarSpeciality/SidebarSpeciality';
import { Outlet } from 'react-router-dom';
import { SectorType } from '../../types/types';

const Specialities = () => {
  const [sectors, setSectors] = useState<SectorType[] | null>(null);

  useEffect(() => {
    getSpecialities();
  }, []);

  const getSpecialities = async () => {
    const response = await axiosInstance.get('/sector');
    setSectors(response.data);
  };

  const settingSectors = (sectors: SectorType[]) => {
    setSectors(sectors);
  };

  return (
    <div className="speciality">
      <div className="speciality-head">
        <h1 className="speciality-title">
          <span className="speciality-title-span">PROYECTOS</span>
        </h1>
      </div>
      <div className="speciality-main">
        {sectors && (
          <SidebarSpeciality
            sectors={sectors}
            onSave={getSpecialities}
            settingSectors={settingSectors}
          />
        )}
        <Outlet />
      </div>
      <CardRegisterProject onSave={getSpecialities} />
    </div>
  );
};

export default Specialities;
