import { NextLevel } from '../../../types/types';
import './projectLevel.css';
interface ProjectLevelProps {
  data: NextLevel;
}

const ProjectLevel = ({ data }: ProjectLevelProps) => {
  return (
    <div className={`SidebarSpecialityLvlList-sub-list-item `}>
      <div className={`SidebarSpecialityLvlList-section `}>
        <>
          <h4 className={`SidebarSpecialityLvlList-sub-list-name     `}>
            {data.name}
          </h4>
          <>
            <img
              src="/svg/down.svg"
              className="SidebarSpecialityLvlList-dropdown-arrow"
            />
            <input
              type="checkbox"
              className="SidebarSpecialityLvlList-dropdown-check"
              defaultChecked={false}
            />
          </>
        </>
      </div>
    </div>
  );
};

export default ProjectLevel;
