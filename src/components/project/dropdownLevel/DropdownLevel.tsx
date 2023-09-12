import { Level } from '../../../types/types';
import LevelSubtask from '../levelSubtask/LevelSubtask';
import ProjectAddLevel from '../projectAddLevel/ProjectAddLevel';
import ProjectLevel from '../projectLevel/ProjectLevel';
import './dropdownLevel.css';

interface DropdownLevel {
  level: Level;
  onSave?: () => void;
}

const DropdownLevel = ({ level, onSave }: DropdownLevel) => {
  const firstLevel = level.level === 0;
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
          <LevelSubtask subtasks={level?.subTasks} />
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
                <ProjectLevel data={subLevel} onSave={onSave} />
                <DropdownLevel level={subLevel} onSave={onSave} />
              </li>
            ))}
            <ProjectAddLevel data={level} onSave={onSave} />
          </>
        )}
      </ul>
    </div>
  );
};

export default DropdownLevel;
