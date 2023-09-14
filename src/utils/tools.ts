import { Level } from '../types/types';

export const findProject = (data: Level[]): boolean => {
  let existProyect = false;
  for (let el of data) {
    if (existProyect) return true;
    existProyect = el.isProject;
    if (!existProyect && el.nextLevel) {
      existProyect = findProject(el.nextLevel);
    }
  }
  return existProyect;
};
