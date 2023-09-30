import { FocusEvent, useCallback, useState } from 'react';
import './sidebarSpeciality.css';
import { ProjectType, SectorType } from '../../../types/types';
import SidebarSpecialityLvlList from './sidebarSpecialityLvlList/SidebarSpecialityLvlList';
import SidebarSpecialityAddLvl from './sidebarSpecialityAddLvl/SidebarSpecialityAddLvl';
import { Select } from '../..';
import { yearData } from '../const';
import { axiosInstance } from '../../../services/axiosInstance';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useNavigate } from 'react-router-dom';
import { rolSecondLevel } from '../../../utils/roles';
import { useMotionValue, motion, PanInfo } from 'framer-motion';
import LoaderForComponent from '../../shared/loaderForComponent/LoaderForComponent';
interface SidebarSpecialityProps {
  settingSectors: (value: SectorType[]) => void;
  sectors: SectorType[] | null;
  onSave?: () => void;
}

const SidebarSpeciality = ({
  settingSectors,
  sectors,
  onSave,
}: SidebarSpecialityProps) => {
  const navigate = useNavigate();
  const handleProjectNavigate = (project: ProjectType) => {
    const { id, stages } = project;
    let urlNavigate = `proyecto/${id}`;
    if (stages.length > 0) {
      const stageId = stages[0].id;
      urlNavigate += `/etapa/${stageId}`;
    }
    navigate(urlNavigate);
  };
  const mWidth = useMotionValue(300);
  const { role } = useSelector((state: RootState) => state.userSession);
  const authUsers = rolSecondLevel.includes(role);
  const [contentVisible, setContentVisible] = useState(true);
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

  const handleDrag = useCallback(
    (_event: MouseEvent, info: PanInfo) => {
      const newWidth = mWidth.get() + info.delta.x;
      if (newWidth < 100) {
        setContentVisible(false);
      } else {
        setContentVisible(true);
      }
      if (newWidth > 21 && newWidth < 600) {
        mWidth.set(mWidth.get() + info.delta.x);
      }
    },
    [mWidth]
  );
  const style = {
    width: mWidth,
  };
  return (
    <motion.aside className={`sidebarSpeciality `} style={style}>
      {sectors ? (
        <>
          {contentVisible && (
            <Select
              label="Año de Especialidad:"
              required={true}
              name="typeSpeciality"
              data={yearData}
              itemKey="year"
              onChange={handleFilterForYear}
              textField="year"
            />
          )}
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
                              {speciality.typeSpecialities?.map(
                                typespeciality => (
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
                                        {typespeciality?.projects?.map(
                                          project => (
                                            <li
                                              key={project.id}
                                              className="sidebarSpeciality-dropdown-sub-list"
                                              onClick={() => {
                                                handleProjectNavigate(project);
                                                handleTaks(
                                                  project.name,
                                                  project.id
                                                );
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
                                          )
                                        )}
                                        {authUsers && (
                                          <SidebarSpecialityAddLvl
                                            onSave={onSave}
                                            idValue={typespeciality.id}
                                            keyNameId="typespecialityId"
                                            nameLevel="Añadir nuevo proyecto"
                                          />
                                        )}
                                      </ul>
                                    </div>
                                  </li>
                                )
                              )}
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
          <motion.div
            drag="x"
            onDrag={handleDrag}
            dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
            dragElastic={0}
            dragMomentum={false}
            className="sidebarSpeciality-resize-content"
          />
        </>
      ) : (
        <LoaderForComponent />
      )}
    </motion.aside>
  );
};

export default SidebarSpeciality;
