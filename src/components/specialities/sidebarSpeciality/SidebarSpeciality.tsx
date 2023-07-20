import { useState } from 'react';
import './sidebarSpeciality.css';
import { SectorType } from '../../../types/types';
import SidebarSpecialityLvlList from './sidebarSpecialityLvlList/SidebarSpecialityLvlList';
interface SidebarSpecialityProps {
  sectors: SectorType[];
  getProjects: (id: number) => void;
}
const SidebarSpeciality = ({
  sectors,
  getProjects,
}: SidebarSpecialityProps) => {
  const [isShow, setIsShow] = useState<boolean>(false);
  const handleShow = () => setIsShow(!isShow);

  const handleProjects = (especialityId: number) => getProjects(especialityId);

  return (
    <aside
      className={`sidebarSpeciality ${isShow && 'sidebarSpeciality-show'}`}
    >
      <h2 className="sidebarSpeciality-title">Sector :</h2>
      <div className="sidebarSpeciality-slice">
        <ul className="aside-dropdown">
          {sectors.map(sector => (
            <li key={sector.id} className="sidebarSpeciality-dropdown-list">
              <SidebarSpecialityLvlList data={sector} type="sector" />
              <div className="sidebarSpeciality-dropdown-content">
                <ul className="sidebarSpeciality-dropdown-sub">
                  {sector.specialities.map(speciality => (
                    <li
                      key={speciality.id}
                      className="sidebarSpeciality-dropdown-sub-list"
                      onClick={() => handleProjects(speciality.id)}
                    >
                      <SidebarSpecialityLvlList
                        data={speciality}
                        type="speciality"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="sidebarSpeciality-slide" onClick={handleShow}>
        <img
          src="/svg/down-white.svg"
          alt="reportes"
          className={`sidebarSpeciality-slide-icon ${
            isShow && 'sidebarSpeciality-slide-icon-rotate'
          }`}
        />
        <img
          src="/svg/trapecio2.svg"
          alt="trapecio"
          className="sidebarSpeciality-trapecio"
        />
      </div>
    </aside>
  );
};

export default SidebarSpeciality;
