import { useSelector } from 'react-redux';
import { Level } from '../../../../../../types';
import './dropdownLevel.css';
import { RootState } from '../../../../../../store';
import {
  ProjectAddLevelBasics,
  ProjectLevelBasics,
  LevelSubtaskGeneral,
} from '..';

interface DropdownLevelBasics {
  level: Level;
  onSave?: () => void;
}

export const DropdownLevelBasics = ({ level, onSave }: DropdownLevelBasics) => {
  const modAuthProject = useSelector(
    (state: RootState) => state.modAuthProject
  );
  const userSessionId = useSelector((state: RootState) => state.userSession.id);

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
          <LevelSubtaskGeneral onSave={onSave} level={level} option="basic" />
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
                <DropdownLevelBasics level={subLevel} onSave={onSave} />
              </li>
            ))}
            {modAuthArea && <ProjectAddLevelBasics data={level} />}
          </>
        )}
      </ul>
    </div>
  );
};

export default DropdownLevelBasics;
