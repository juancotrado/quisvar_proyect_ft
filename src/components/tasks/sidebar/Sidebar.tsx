import { useState } from 'react';
import { WorkArea } from '../../../types/types';
import './sidebar.css';
import { CardRegisterArea } from '../..';

interface SidebarProps {
  workArea: WorkArea;
  settingSubTasks: (id: number) => void;
}

const Sidebar = ({ workArea, settingSubTasks }: SidebarProps) => {
  const { name, indexTasks, ...areaData } = workArea;
  const workAreaInfo = { ...areaData, name };
  const [openEditArea, setOpenEditArea] = useState(true);
  const [isShow, setIsShow] = useState<boolean>(true);
  const handleEditArea = () => setOpenEditArea(!openEditArea);
  const handleShow = () => setIsShow(!isShow);
  return (
    <aside className={`aside ${isShow && 'aside-show'}`}>
      <div className="aside-container-title">
        <h2 className="aside-title">{name}</h2>
        <button className="area-menu-button" onClick={handleEditArea}>
          <img src="/svg/menu.svg" alt="menu" />
        </button>
        {openEditArea && (
          <CardRegisterArea
            onClose={handleEditArea}
            projectId={workArea.projectId}
            dataWorkArea={workAreaInfo}
          />
        )}
      </div>
      <div className="asilde-slice">
        <ul className="aside-dropdown">
          {indexTasks.map(indexTask => (
            <li key={indexTask.id} className="aside-dropdown-list">
              <div className="aside-dropdown-section">
                <img
                  src="/svg/reports.svg"
                  alt="reportes"
                  className="aside-dropdown-icon"
                />
                <span>{indexTask.name}</span>
                <img src="/svg/down.svg" className="aside-dropdown-arrow" />
                <input type="checkbox" className="aside-dropdown-check" />
              </div>
              <div className="aside-dropdown-content">
                <ul className="aside-dropdown-sub">
                  {indexTask.tasks.map(task => (
                    <li
                      key={task.id}
                      className="aside-dropdown-sub-list"
                      onClick={() => settingSubTasks(task.id)}
                    >
                      {task.name.toLowerCase()}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="aside-slide" onClick={handleShow}>
        <img
          src="/svg/down-white.svg"
          alt="reportes"
          className={`aside-slide-icon ${isShow && 'aside-slide-icon-rotate'}`}
        />
        <img src="/svg/trapecio2.svg" alt="trapecio" className="trapecio" />
      </div>
    </aside>
  );
};

export default Sidebar;
