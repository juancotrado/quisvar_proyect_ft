import { FocusEvent } from 'react';
import './sidebarSpeciality.css';
import { SectorType } from '../../../types/types';
import SidebarSpecialityLvlList from './sidebarSpecialityLvlList/SidebarSpecialityLvlList';
import SidebarSpecialityAddLvl from './sidebarSpecialityAddLvl/SidebarSpecialityAddLvl';
import { Select } from '../..';
import { yearData } from '../const';
import { axiosInstance } from '../../../services/axiosInstance';
interface SidebarSpecialityProps {
  settingSectors: (value: SectorType[]) => void;
  sectors: SectorType[];
  getProjects: (id: number) => void;
  onSave?: () => void;
}
const SidebarSpeciality = ({
  settingSectors,
  sectors,
  getProjects,
  onSave,
}: SidebarSpecialityProps) => {
  const handleProjects = (especialityId: number) => getProjects(especialityId);
  const handleFilterForYear = async (e: FocusEvent<HTMLSelectElement>) => {
    const { data } = await axiosInstance.get<SectorType[]>('/sector');
    const { value } = e.target;
    const filterForYear = data
      .map(sector => {
        const specialitiesFilter = sector.specialities.filter(spaciality => {
          const year = new Date(spaciality.createdAt).getFullYear();
          return year === +value;
        });
        return {
          ...sector,
          specialities: specialitiesFilter,
        };
      })
      .filter(sector => sector.specialities.length);
    settingSectors(filterForYear);
  };

  return (
    <aside className={`sidebarSpeciality `}>
      <Select
        label="Año de Especialidad:"
        required={true}
        name="typeSpeciality"
        data={yearData}
        itemKey="year"
        onChange={handleFilterForYear}
        textField="year"
      />
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
                    >
                      <SidebarSpecialityLvlList
                        data={speciality}
                        type="speciality"
                      />
                      <div className="sidebarSpeciality-dropdown-content">
                        <ul className="sidebarSpeciality-dropdown-sub">
                          {speciality.typeSpecialities?.map(typespeciality => (
                            <li
                              key={typespeciality.id}
                              className="sidebarSpeciality-dropdown-sub-list"
                              onClick={() => handleProjects(typespeciality.id)}
                            >
                              <SidebarSpecialityLvlList
                                data={typespeciality}
                                type="typespeciality"
                                onSave={onSave}
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
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
