import { useState } from 'react';
import { WorkArea } from '../../../types/types';
import './sidebar.css';
import { CardRegisterArea } from '../..';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import TaskListContainer from './TaskListContainer';
import IndexTaskContainer from './IndexTaskContainer';
import SidebarAddNewLevel from './sidebarAddNewLevel/SidebarAddNewLevel';

type SettingType = 'task' | 'indextask';

interface SidebarProps {
  workArea: WorkArea;
  onUpdate?: () => void;
  settingSubTasks: (id: number, type: SettingType) => void;
  isShowInitValue: boolean;
}

const Sidebar = ({
  workArea,
  settingSubTasks,
  onUpdate,
  isShowInitValue,
}: SidebarProps) => {
  const { userSession } = useSelector((state: RootState) => state);
  const [isShow, setIsShow] = useState<boolean>(isShowInitValue);
  const [openEditArea, setOpenEditArea] = useState<boolean>(false);
  const { name, item, indexTasks, user, ...areaData } = workArea;
  const role = userSession?.role ? userSession.role : 'EMPLOYEE';
  const profileUser = user?.profile;
  const workAreaInfo = { ...areaData, name };
  const [taskSelected, setTaskSelected] = useState<number | null>(null);

  const handleEditArea = () => setOpenEditArea(!openEditArea);
  const handleShow = () => setIsShow(!isShow);

  const handleTaks = (
    id: number,
    type: 'task' | 'indextask',
    isUnique: boolean = false
  ) => {
    if (!isUnique) return;
    settingSubTasks(id, type);
    setTaskSelected(id);
  };

  return (
    <aside className={`aside ${isShow && 'aside-show'}`}>
      <div className="aside-container-title">
        <div className="aside-title-info">
          <h2 className="aside-title">{`${
            item !== '0' ? item + '.' : ''
          } ${name}`}</h2>
          <span className={`${profileUser || 'aside-coordinator-off'}`}>
            {profileUser
              ? `${profileUser.firstName} ${profileUser.lastName}`
              : ' Agregar Coordinador *'}
          </span>
        </div>
        {role !== 'EMPLOYEE' && (
          <button className="area-menu-button" onClick={handleEditArea}>
            <img src="/svg/menu.svg" alt="menu" />
          </button>
        )}
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
            <li
              key={indexTask.id}
              className="aside-dropdown-list"
              onClick={() =>
                handleTaks(indexTask.id, 'indextask', indexTask.unique)
              }
            >
              <IndexTaskContainer indexTask={indexTask} onSave={onUpdate} />
              {indexTask.unique || (
                <div className="aside-dropdown-content">
                  <ul className="aside-dropdown-sub">
                    {indexTask.tasks.map(task => (
                      <li
                        className="aside-dropdown-sub-list"
                        onClick={() => handleTaks(task.id, 'task', task.unique)}
                      >
                        <TaskListContainer
                          key={task.id}
                          task={task}
                          // settingSubTask={() => handleTaks(task.id, 'task')}
                          onSave={onUpdate}
                          taskSelected={taskSelected}
                        />
                        {task.unique || (
                          <div className="aside-dropdown-content">
                            <ul className="aside-dropdown-sub">
                              {/* {indexTask.tasks.map(task => (
                              <li
                                className="aside-dropdown-sub-list "
                                onClick={() =>
                                  handleTaks(task.id, 'task', task.unique)
                                }
                              >
                                <TaskListContainer
                                  key={task.id}
                                  task={task}
                                  // settingSubTask={() => handleTaks(task.id, 'task')}
                                  onSave={onUpdate}
                                  taskSelected={taskSelected}
                                />
                              </li>
                            ))} */}
                              {role !== 'EMPLOYEE' && (
                                <li>
                                  <SidebarAddNewLevel
                                    idValue={task.id}
                                    keyNameId="taskId"
                                    onSave={onUpdate}
                                  />
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </li>
                    ))}
                    {role !== 'EMPLOYEE' && (
                      <li>
                        <SidebarAddNewLevel
                          idValue={indexTask.id}
                          keyNameId="indexTaskId"
                          onSave={onUpdate}
                        />
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </li>
          ))}
          {role !== 'EMPLOYEE' && (
            <li>
              <SidebarAddNewLevel
                idValue={workArea.id}
                keyNameId="workAreaId"
                onSave={onUpdate}
              />
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
