import { useContext } from 'react';
import { useListHistory } from '../../hooks';
import { TaskContext } from '../../../../components/taskCard/TaskCard';
import './taskHistory.css';
import { PiClipboardTextBold } from 'react-icons/pi';
import { COLOR_CSS } from '../../../../../../../../utils/cssData';
import { TaskHistoryItem } from '../taskHistoryItem';
import { LoaderOnly, LoaderText } from '../../../../../../../../components';

const TaskHistory = () => {
  const { task } = useContext(TaskContext);
  const { listTaskHistoryQuery } = useListHistory(task.id);

  const getUserParse = (user: string) => {
    const userParse = JSON.parse(user) as {
      fullname: string;
      dni: string;
    };
    return userParse;
  };

  return (
    <div className="taskHistory">
      <h2 className="task-label">
        <PiClipboardTextBold
          color={COLOR_CSS.secondary}
          size={21}
          cursor={'pointer'}
        />
        Toda la actividad
        {listTaskHistoryQuery.isFetching && (
          <LoaderOnly position="absolute" right={0.9} />
        )}
      </h2>
      {listTaskHistoryQuery.isLoading && (
        <LoaderText text="Cargando..." style={{ height: '100%' }} />
      )}
      <div className="taskHistory-items scroll-slim">
        {listTaskHistoryQuery.data?.map(feedback => (
          <>
            {feedback.reviewer && (
              <TaskHistoryItem
                createdAt={feedback.updatedAt}
                key={'evaluator' + feedback.id}
                user={getUserParse(feedback.reviewer)}
                comment={feedback.comment}
                status={feedback.type}
                mode={'evaluator'}
              />
            )}
            <TaskHistoryItem
              createdAt={feedback.createdAt}
              files={feedback.files}
              key={'technical' + feedback.id}
              user={getUserParse(feedback.author)}
              percentage={feedback.percentage}
              mode={'technical'}
            />
          </>
        ))}
      </div>
    </div>
  );
};

export default TaskHistory;
