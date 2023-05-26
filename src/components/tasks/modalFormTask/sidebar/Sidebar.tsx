import { useState } from 'react';
import { WorkArea } from '../../../../types/types';
import './sidebar.css';

interface SidebarProps {
  workArea: WorkArea;
}

const Sidebar = ({ workArea }: SidebarProps) => {
  const { name, indexTasks } = workArea;

  const [isShow, setIsShow] = useState<boolean>(false);

  const handleShow = () => setIsShow(!isShow);
  return (
    <aside className={`aside ${isShow && 'aside-show'}`}>
      <h2 className="aside-title">{name}</h2>
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
                    <li key={task.id} className="aside-dropdown-sub-list">
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
      </div>
    </aside>
  );
};

export default Sidebar;
