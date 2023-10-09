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

export const getIconDefault = (seed: string) => {
  const urlIconDefault = `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${seed}&rotate=10&backgroundColor=00897b,00acc1,039be5,1e88e5,3949ab,43a047,546e7a,5e35b1,6d4c41,757575,7cb342,8e24aa,c0ca33,d81b60,e53935,f4511e,fb8c00,fdd835,ffb300,ffdfbf&eyes=bulging,dizzy,eva,frame1,frame2,glow,happy,robocop,round,roundFrame01,roundFrame02,sensor,shade01`;
  // const urlIconDefault = `https://robohash.org/${seed}`;//robohash
  return urlIconDefault;
};
