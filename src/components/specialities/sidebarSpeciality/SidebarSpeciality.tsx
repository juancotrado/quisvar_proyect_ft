import './sidebarSpeciality.css';
import { SectorType } from '../../../types/types';
import SidebarSpecialityLvlList from './sidebarSpecialityLvlList/SidebarSpecialityLvlList';
import SidebarSpecialityAddLvl from './sidebarSpecialityAddLvl/SidebarSpecialityAddLvl';
interface SidebarSpecialityProps {
  sectors: SectorType[];
  getProjects: (id: number) => void;
  onSave?: () => void;
}
const SidebarSpeciality = ({
  sectors,
  getProjects,
  onSave,
}: SidebarSpecialityProps) => {
  const handleProjects = (especialityId: number) => getProjects(especialityId);

  return (
    <aside className={`sidebarSpeciality `}>
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
                        onSave={onSave}
                      />
                    </li>
                  ))}
                  <SidebarSpecialityAddLvl
                    onSave={onSave}
                    idValue={sector.id}
                  />
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default SidebarSpeciality;
