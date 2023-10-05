import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import {
  DataSidebarSpeciality,
  ProjectType,
  SectorType,
  SpecialityType,
  TypeSpecialities,
} from '../../../../types/types';
import { rolSecondLevel } from '../../../../utils/roles';
import './dropDownSidebarSpeciality.css';
import SidebarSpecialityLvlList from '../sidebarSpecialityLvlList/SidebarSpecialityLvlList';
import { useState } from 'react';
import SidebarSpecialityAddLvl from '../sidebarSpecialityAddLvl/SidebarSpecialityAddLvl';
import { useNavigate } from 'react-router';
interface DropDownSidebarSpecialityProps {
  data: DataSidebarSpeciality;
  onSave?: () => void;
}
const DropDownSidebarSpeciality = ({
  data,
  onSave,
}: DropDownSidebarSpecialityProps) => {
  const levelData =
    data.specialities ?? data.typeSpecialities ?? data.projects ?? data.sectors;
  const type = data.specialities
    ? 'specialities'
    : data.typeSpecialities
    ? 'typespecialities'
    : data.projects
    ? 'projects'
    : 'sector';
  const keyNameId = data.specialities
    ? 'sectorId'
    : data.typeSpecialities
    ? 'specialitiesId'
    : data.projects
    ? 'typespecialityId'
    : 'noId';
  if (!levelData) return <></>;
  const { role } = useSelector((state: RootState) => state.userSession);
  const [indexSelected, setIndexSelected] = useState('');
  const navigate = useNavigate();
  const authUsers = rolSecondLevel.includes(role);
  const handleTaks = (name: string, especialties?: number) => {
    if (especialties === undefined) return;
    setIndexSelected(name + '-' + especialties);
  };
  const handleProjectNavigate = (
    project: TypeSpecialities | SpecialityType | ProjectType | SectorType
  ) => {
    if ('stages' in project) {
      const { id, stages } = project;
      let urlNavigate = `proyecto/${id}`;
      if (stages.length > 0) {
        const stageId = stages[0].id;
        urlNavigate += `/etapa/${stageId}`;
      }
      navigate(urlNavigate);
    }
  };

  return (
    <div
      className={`${
        type === 'sector'
          ? 'dropDownSidebarSpeciality-slice'
          : 'dropDownSidebarSpeciality-dropdown-content'
      }`}
    >
      <ul
        className={`${
          type === 'sector'
            ? 'aside-dropdown'
            : 'dropDownSidebarSpeciality-dropdown-sub'
        }`}
      >
        {levelData?.map(subLevel => (
          <li
            key={subLevel.id}
            className={`${
              type === 'sector' && 'dropDownSidebarSpeciality-dropdown-sub-list'
            }`}
            onClick={() => {
              handleProjectNavigate(subLevel);
              if (type === 'projects') handleTaks(subLevel.name, subLevel.id);
            }}
          >
            <SidebarSpecialityLvlList
              authUser={authUsers}
              data={subLevel}
              type={type}
              onSave={onSave}
              indexSelected={type === 'projects' ? indexSelected : ''}
            />
            <DropDownSidebarSpeciality data={subLevel} onSave={onSave} />
          </li>
        ))}
        {authUsers && (
          <SidebarSpecialityAddLvl
            onSave={onSave}
            idValue={data.id}
            keyNameId={keyNameId}
            nameLevel={`${
              type === 'projects' ? 'Añadir nuevo proyecto' : 'Añadir nivel'
            }`}
          />
        )}
      </ul>
    </div>
  );
};

export default DropDownSidebarSpeciality;
