import { Level } from '../types/types';

export const findProject = (data: Level[]): boolean => {
  let existProyect = false;
  for (const el of data) {
    if (existProyect) return true;
    existProyect = el.isProject;
    if (!existProyect && el.nextLevel) {
      existProyect = findProject(el.nextLevel);
    }
  }
  return existProyect;
};

export const getFirstLetterNames = (firstName: string, lastName: string) => {
  const firstLetterFirstName = firstName[0].toUpperCase();
  const firstLetterLastName = lastName[0].toUpperCase();
  return firstLetterFirstName + firstLetterLastName;
};
