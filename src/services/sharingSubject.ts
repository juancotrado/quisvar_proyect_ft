import SubjectManager from '../models/subjectManager';

export const loader$ = new SubjectManager<boolean>();
export const toggle$ = new SubjectManager<boolean>();
export const isOpenModal$ = new SubjectManager<boolean>();
