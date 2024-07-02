import { useContext } from 'react';
import { TaskContext } from '../taskCard/TaskCard';
import './taskCardHeader.css';
import { COLOR_CSS } from '../../../../../../utils/cssData';
import { PiClockCounterClockwiseBold } from 'react-icons/pi';

import { TaskPermission } from '../../models';
import { PiClipboardTextBold } from 'react-icons/pi';
import { useEmitWithLoader } from '../../../../../../hooks';
import { isOpenButtonDelete$ } from '../../../../../../services/sharingSubject';
const TaskCardHeader = () => {
  const { task, hasPermission, handleViewHistory } = useContext(TaskContext);
  const { emitWithLoader } = useEmitWithLoader();

  const restoreTask = () => {
    // emitWithLoader('client:restore-basic-task', task.id);
    isOpenButtonDelete$.setSubject = {
      isOpen: true,
      function: () => emitWithLoader('client:restore-basic-task', task.id),
    };
  };

  return (
    <div className="TaskCardHeader">
      <h4 className="TaskCardHeader-title">
        Título de la tarea:{' '}
        <span className="TaskCardHeader-title-span">
          {task.item} {task.name}
        </span>
      </h4>
      <div className="TaskCardHeader-actions">
        <PiClipboardTextBold
          color={COLOR_CSS.secondary}
          size={21}
          cursor={'pointer'}
          onClick={handleViewHistory}
        />
        {hasPermission(TaskPermission.RESET_TASK) && (
          <PiClockCounterClockwiseBold
            color={COLOR_CSS.danger}
            size={21}
            cursor={'pointer'}
            onClick={restoreTask}
          />
        )}
      </div>
    </div>
  );
};

export default TaskCardHeader;
