import { useState } from 'react';
import { WorkArea } from '../../../types/types';
import './sidebar.css';
import { CardRegisterArea } from '../..';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import TaskListContainer from './TaskListContainer';
import IndexTaskContainer from './IndexTaskContainer';
import AddIndexTask from './AddIndexTask';
import AddTask from './AddTask';

interface SidebarProps {
  workArea: WorkArea;
  onUpdate?: () => void;
  settingSubTasks: (id: number) => void;
}

const Sidebar = ({ workArea, settingSubTasks, onUpdate }: SidebarProps) => {
  const { userSession } = useSelector((state: RootState) => state);
  const [isShow, setIsShow] = useState<boolean>(true);
  const [openEditArea, setOpenEditArea] = useState<boolean>(false);
  const { name, indexTasks, user, ...areaData } = workArea;
  const role = userSession?.role ? userSession.role : 'EMPLOYEE';
  const profileUser = user?.profile;
  const workAreaInfo = { ...areaData, name };

  const handleEditArea = () => setOpenEditArea(!openEditArea);
  const handleShow = () => setIsShow(!isShow);

  return (
    <aside className={`aside ${isShow && 'aside-show'}`}>
      <div className="aside-container-title">
        <div className="aside-title-info">
          <h2 className="aside-title">{name}</h2>
          <span className={`${profileUser || 'aside-coordinator-off'}`}>
            {profileUser
              ? `${profileUser.firstName} ${profileUser.lastName}`
              : ' Agregar Coordinador *'}
          </span>
        </div>
        <button className="area-menu-button" onClick={handleEditArea}>
          <img src="/svg/menu.svg" alt="menu" />
        </button>
        {openEditArea && (
          <CardRegisterArea
            onClose={handleEditArea}
            projectId={workArea.projectId}
            dataWorkArea={workAreaInfo}
            onSave={onUpdate}
          />
        )}
      </div>
      <div className="asilde-slice">
        <ul className="aside-dropdown">
          {indexTasks.map(indexTask => (
            <li key={indexTask.id} className="aside-dropdown-list">
              <IndexTaskContainer indexTask={indexTask} onSave={onUpdate} />
              <div className="aside-dropdown-content">
                <ul className="aside-dropdown-sub">
                  {indexTask.tasks.map(task => (
                    <TaskListContainer
                      key={task.id}
                      task={task}
                      settingSubTask={() => settingSubTasks(task.id)}
                      onSave={onUpdate}
                    />
                  ))}
                  {role !== 'EMPLOYEE' && (
                    <li>
                      <AddTask indexTaskId={indexTask.id} onSave={onUpdate} />
                    </li>
                  )}
                </ul>
              </div>
            </li>
          ))}
          {role !== 'EMPLOYEE' && (
            <li>
              <AddIndexTask workAreaId={workArea.id} onSave={onUpdate} />
            </li>
          )}
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
