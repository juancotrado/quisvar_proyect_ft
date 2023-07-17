import { StatusType, SubTask } from '../../../types/types';
import './TaskCounter.css';
interface TaskCounter {
  nivelTask: any;
  className?: string;
}

const TaskCounter = ({ nivelTask, className }: TaskCounter) => {
  const selectTaskCounter = (status: StatusType[]) => {
    if (nivelTask?.unique) {
      return nivelTask.subTasks.filter((subTask: SubTask) =>
        status.includes(subTask.status)
      ).length;
    }
    const tasks = nivelTask.indexTasks
      ? nivelTask.indexTasks
      : nivelTask.tasks
      ? nivelTask.tasks
      : nivelTask.tasks_2
      ? nivelTask.tasks_2
      : nivelTask.tasks_3;

    return countSubTasks(tasks, status);
  };

  const countSubTasks = (tasks: any, status: StatusType[]) => {
    let count = 0;

    for (const task of tasks) {
      if (task.unique) {
        count += task.subTasks.filter((subTask: SubTask) =>
          status.includes(subTask.status)
        ).length;
      }
      if (task.tasks && task.tasks.length > 0) {
        count += countSubTasks(task.tasks, status);
      }

      if (task.tasks_2 && task.tasks_2.length > 0) {
        count += countSubTasks(task.tasks_2, status);
      }

      if (task.tasks_3 && task.tasks_3.length > 0) {
        count += countSubTasks(task.tasks_3, status);
      }
    }

    return count;
  };

  const unresolvedCount = selectTaskCounter(['UNRESOLVED']);
  const inReviewAndProcessCount = selectTaskCounter([
    'PROCESS',
    'INREVIEW',
    'DENIED',
  ]);
  const doneCount = selectTaskCounter(['DONE']);
  return (
    <div className={`task-counter-container ${className}`}>
      {unresolvedCount !== 0 && (
        <span className="task-counter-unresolved">({unresolvedCount})</span>
      )}
      {inReviewAndProcessCount !== 0 && (
        <span className="task-counter-process">
          ({inReviewAndProcessCount})
        </span>
      )}
      {doneCount !== 0 && (
        <span className="task-counter-done">({doneCount})</span>
      )}
    </div>
  );
};

export default TaskCounter;
