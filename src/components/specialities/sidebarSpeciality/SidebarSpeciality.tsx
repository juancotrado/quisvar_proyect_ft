import { FocusEvent, useState } from 'react';
import './sidebarSpeciality.css';
import { SectorType } from '../../../types/types';
import SidebarSpecialityLvlList from './sidebarSpecialityLvlList/SidebarSpecialityLvlList';
import SidebarSpecialityAddLvl from './sidebarSpecialityAddLvl/SidebarSpecialityAddLvl';
import { Select } from '../..';
import { yearData } from '../const';
import { axiosInstance } from '../../../services/axiosInstance';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useNavigate } from 'react-router-dom';
import { rolSecondLevel } from '../../../utils/roles';
interface SidebarSpecialityProps {
  settingSectors: (value: SectorType[]) => void;
  sectors: SectorType[];
  onSave?: () => void;
}

const SidebarSpeciality = ({
  settingSectors,
  sectors,
  onSave,
}: SidebarSpecialityProps) => {
  const navigate = useNavigate();
  const handleProjectNavigate = (projectId: number) => {
    navigate(`etapa/${projectId}`);
  };
  const { role } = useSelector((state: RootState) => state.userSession);
  const authUsers = rolSecondLevel.includes(role);
  const [indexSelected, setIndexSelected] = useState('');
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

  const handleTaks = (name: string, especialties?: number) => {
    if (especialties === undefined) return;
    setIndexSelected(name + '-' + especialties);
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
              <SidebarSpecialityLvlList
                authUser={authUsers}
                data={sector}
                type="sector"
                indexSelected={indexSelected}
              />
              <div className="sidebarSpeciality-dropdown-content">
                <ul className="sidebarSpeciality-dropdown-sub">
                  {sector.specialities.map(speciality => (
                    <li
                      key={speciality.id}
                      className="sidebarSpeciality-dropdown-sub-list"
                    >
                      <SidebarSpecialityLvlList
                        authUser={authUsers}
                        data={speciality}
                        type="specialities"
                        onSave={onSave}
                        indexSelected={indexSelected}
                      />
                      <div className="sidebarSpeciality-dropdown-content">
                        <ul className="sidebarSpeciality-dropdown-sub">
                          {speciality.typeSpecialities?.map(typespeciality => (
                            <li
                              key={typespeciality.id}
                              className="sidebarSpeciality-dropdown-sub-list"
                            >
                              <SidebarSpecialityLvlList
                                authUser={authUsers}
                                data={typespeciality}
                                type="typespecialities"
                                onSave={onSave}
                                indexSelected={indexSelected}
                              />
                              <div className="sidebarSpeciality-dropdown-content">
                                <ul className="sidebarSpeciality-dropdown-sub">
                                  {typespeciality?.projects?.map(project => (
                                    <li
                                      key={project.id}
                                      className="sidebarSpeciality-dropdown-sub-list"
                                      onClick={() => {
                                        handleProjectNavigate(project.id);
                                      }}
                                    >
                                      <SidebarSpecialityLvlList
                                        authUser={authUsers}
                                        data={project}
                                        type="projects"
                                        onSave={onSave}
                                        indexSelected={indexSelected}
                                      />
                                    </li>
                                  ))}
                                  {authUsers && (
                                    <SidebarSpecialityAddLvl
                                      onSave={onSave}
                                      idValue={typespeciality.id}
                                      keyNameId="typespecialityId"
                                    />
                                  )}
                                </ul>
                              </div>
                            </li>
                          ))}
                          {authUsers && (
                            <SidebarSpecialityAddLvl
                              onSave={onSave}
                              idValue={speciality.id}
                              keyNameId="specialitiesId"
                            />
                          )}
                        </ul>
                      </div>
                    </li>
                  ))}
                  {authUsers && (
                    <SidebarSpecialityAddLvl
                      onSave={onSave}
                      idValue={sector.id}
                      keyNameId="sectorId"
                    />
                  )}
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
