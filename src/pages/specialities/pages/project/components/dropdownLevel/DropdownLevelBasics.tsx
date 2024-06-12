import { useSelector } from 'react-redux';
import { Level } from '../../../../../../types';
import './dropdownLevel.css';
import { RootState } from '../../../../../../store';
import {
  ProjectAddLevelBasics,
  ProjectLevelBasics,
  LevelSubtaskGeneral,
} from '..';
import { ProjectContext } from '../../../../../../context';
import { useContext } from 'react';

interface DropdownLevelBasics {
  level: Level;
}

export const DropdownLevelBasics = ({ level }: DropdownLevelBasics) => {
  const modAuthProject = useSelector(
    (state: RootState) => state.modAuthProject
  );
  const userSessionId = useSelector((state: RootState) => state.userSession.id);
  const { cover, dayTask } = useContext(ProjectContext);

  const modAuthArea = modAuthProject || userSessionId === level.userId;
  const firstLevel = !level.level;
  const existSubtask = level?.subTasks?.length;
  if (level.level === 10) return <div></div>;
  return (
    <div className="dropdownLevel-dropdown-content">
      <ul
        className={
          firstLevel ? 'dropdownLevel-dropdown' : 'dropdownLevel-dropdown-sub'
        }
      >
        {existSubtask ? (
          <LevelSubtaskGeneral level={level} option="basic" />
        ) : (
          <>
            {level?.nextLevel?.map(subLevel => (
              <li
                key={subLevel.id}
                className={
                  firstLevel
                    ? 'dropdownLevel-dropdown-list'
                    : 'dropdownLevel-dropdown-sub-list'
                }
              >
                <ProjectLevelBasics data={subLevel} />

                <DropdownLevelBasics level={subLevel} />
              </li>
            ))}
            {modAuthArea && !cover.isEdit && !dayTask.isEdit && (
              <ProjectAddLevelBasics data={level} />
            )}
          </>
        )}
      </ul>
    </div>
  );
};

export default DropdownLevelBasics;
