import { Level } from '../../../../../types';

export const getIdsSubTasksRecursive = (data: Level, ids: number[] = []) => {
  if (data.subTasks) {
    data.subTasks.forEach(subTask => {
      ids.push(subTask.id);
    });
  } else if (data.nextLevel) {
    data.nextLevel.forEach(nivel => {
      ids = getIdsSubTasksRecursive(nivel, ids);
    });
  }
  return ids;
};
