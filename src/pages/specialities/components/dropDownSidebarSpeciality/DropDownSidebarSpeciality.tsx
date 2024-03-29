import {
  DataSidebarSpeciality,
  ProjectType,
  SectorType,
  SpecialityType,
  TypeSpecialities,
} from '../../../../types';
import './dropDownSidebarSpeciality.css';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { SidebarSpecialityAddLvl, SidebarSpecialityLvlList } from '..';
import { useRole } from '../../../../hooks';

interface DropDownSidebarSpecialityProps {
  data: DataSidebarSpeciality;
  onSave?: () => void;
}
const DropDownSidebarSpeciality = ({
  data,
  onSave,
}: DropDownSidebarSpecialityProps) => {
  const [indexSelected, setIndexSelected] = useState('');
  const navigate = useNavigate();

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

  const { hasAccess: authUsers } = useRole('MOD');

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
