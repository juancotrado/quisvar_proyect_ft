import { useSelector } from 'react-redux';
import { Level } from '../../../../../../../../types';
import './dropdownLevel.css';
import { RootState } from '../../../../../../../../store';
import {
  ProjectAddLevelBasics,
  ProjectLevelBasics,
  LevelSubtaskBasics,
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
          <LevelSubtaskBasics onSave={onSave} level={level} />
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
                <ProjectLevelBasics data={subLevel} onSave={onSave} />
                <DropdownLevelBasics level={subLevel} onSave={onSave} />
              </li>
            ))}
            {modAuthArea && (
              <ProjectAddLevelBasics data={level} onSave={onSave} />
            )}
          </>
        )}
      </ul>
    </div>
  );
};

export default DropdownLevelBasics;
