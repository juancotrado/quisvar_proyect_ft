import './specialities.css';
import { CardRegisterProject } from '../../components';
import SidebarSpeciality from '../../components/specialities/sidebarSpeciality/SidebarSpeciality';
import { Outlet } from 'react-router-dom';
import useSector from '../../hooks/useSector';

const Specialities = () => {
  const { getSpecialities, sectors, settingSectors } = useSector();

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
