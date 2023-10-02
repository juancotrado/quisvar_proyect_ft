import './specialities.css';
import SidebarSpeciality from '../../components/specialities/sidebarSpeciality/SidebarSpeciality';
import { Outlet } from 'react-router-dom';

const Specialities = () => {
  return (
    <div className="speciality-main">
      <SidebarSpeciality />
      <Outlet />
    </div>
  );
};

export default Specialities;
