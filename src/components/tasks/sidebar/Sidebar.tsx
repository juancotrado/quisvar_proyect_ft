import { useState } from 'react';
import { TypeTask, WorkArea } from '../../../types/types';
import './sidebar.css';
import { CardRegisterArea } from '../..';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import SidebarAddNewLevel from './sidebarAddNewLevel/SidebarAddNewLevel';
import SidebarLevelList from './sidebarLevelList/SidebarLevelList';

interface SidebarProps {
  workArea: WorkArea;
  onUpdate?: () => void;
  settingSubTasks: (id: number, type: TypeTask) => void;
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
  const { name, project, item, indexTasks, user, ...areaData } = workArea;
  const role = userSession?.role ? userSession.role : 'EMPLOYEE';
  const profileUser = user?.profile;
  const workAreaInfo = { ...areaData, name };

  const handleEditArea = () => setOpenEditArea(!openEditArea);
  const handleShow = () => setIsShow(!isShow);

  const handleTaks = (id: number, type: TypeTask, isUnique?: boolean) => {
    if (!isUnique) return;
    settingSubTasks(id, type);
  };

  return (
    <aside className={`aside ${isShow && 'aside-show'}`}>
      <div className="aside-container-title">
        <div className="aside-title-info">
          <h2 className="aside-title">{`${item !== '0' ? item + '.' : ''} ${
            project.unique ? project.description : name
          }`}</h2>
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
      <div className="aside-slice">
        <ul className="aside-dropdown">
          {indexTasks.map(indexTask => (
            <li
              key={indexTask.id}
              className="aside-dropdown-list"
              onClick={() =>
                handleTaks(indexTask.id, 'indextask', indexTask.unique)
              }
            >
              <SidebarLevelList
                data={indexTask}
                onSave={onUpdate}
                type="indextask"
              />
              {indexTask.unique || (
                <div className="aside-dropdown-content">
                  <ul className="aside-dropdown-sub">
                    {indexTask.tasks.map(task => (
                      <li
                        key={task.id}
                        className="aside-dropdown-sub-list"
                        onClick={() => handleTaks(task.id, 'task', task.unique)}
                      >
                        <SidebarLevelList
                          data={task}
                          onSave={onUpdate}
                          type="task"
                        />
                        {task.unique || (
                          <div className="aside-dropdown-content">
                            <ul className="aside-dropdown-sub">
                              {task.tasks_2.map(task2 => (
                                <li
                                  key={task2.id}
                                  className="aside-dropdown-sub-list "
                                  onClick={() =>
                                    handleTaks(task2.id, 'task2', task2.unique)
                                  }
                                >
                                  <SidebarLevelList
                                    data={task2}
                                    onSave={onUpdate}
                                    type="task2"
                                  />
                                  {task2.unique || (
                                    <div className="aside-dropdown-content">
                                      <ul className="aside-dropdown-sub">
                                        {task2.tasks_3.map(task3 => (
                                          <li
                                            key={task3.id}
                                            className="aside-dropdown-sub-list "
                                            onClick={() =>
                                              handleTaks(
                                                task3.id,
                                                'task3',
                                                task3.unique
                                              )
                                            }
                                          >
                                            <SidebarLevelList
                                              data={task3}
                                              onSave={onUpdate}
                                              type="task2"
                                            />
                                          </li>
                                        ))}
                                        {role !== 'EMPLOYEE' && (
                                          <SidebarAddNewLevel
                                            idValue={task2.id}
                                            keyNameId="task_2_Id"
                                            onSave={onUpdate}
                                          />
                                        )}
                                      </ul>
                                    </div>
                                  )}
                                </li>
                              ))}
                              {role !== 'EMPLOYEE' && (
                                <SidebarAddNewLevel
                                  idValue={task.id}
                                  keyNameId="taskId"
                                  onSave={onUpdate}
                                />
                              )}
                            </ul>
                          </div>
                        )}
                      </li>
                    ))}
                    {role !== 'EMPLOYEE' && (
                      <SidebarAddNewLevel
                        idValue={indexTask.id}
                        keyNameId="indexTaskId"
                        onSave={onUpdate}
                      />
                    )}
                  </ul>
                </div>
              )}
            </li>
          ))}
          {role !== 'EMPLOYEE' && (
            <SidebarAddNewLevel
              idValue={workArea.id}
              keyNameId="workAreaId"
              onSave={onUpdate}
            />
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
