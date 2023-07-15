import { IndexTask, StatusType, Task } from '../../../types/types';
import './TaskCounter.css';
interface TaskCounter {
  tasks: IndexTask[];
  className?: string;
}
const TaskCounter = ({ tasks, className }: TaskCounter) => {
  const countSubTasks = (tasks: IndexTask[] | Task[], status: StatusType) => {
    let count = 0;

    for (const task of tasks) {
      if (task.unique) {
        count += task.subTasks.filter(
          subTask => subTask.status === status
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

  // Obtén los conteos para cada estado
  const unresolvedCount = countSubTasks(tasks, 'UNRESOLVED');
  const inReviewAndProcessCount =
    countSubTasks(tasks, 'INREVIEW') + countSubTasks(tasks, 'PROCESS');
  const doneCount = countSubTasks(tasks, 'DONE');
  return (
    <div className={`task-counter-container ${className}`}>
      <span className="task-counter-unresolved">({unresolvedCount})</span>
      <span className="task-counter-process">({inReviewAndProcessCount})</span>
      <span className="task-counter-done">({doneCount})</span>
    </div>
  );
};

export default TaskCounter;
