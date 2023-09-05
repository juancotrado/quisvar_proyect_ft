import SubjectManager from '../models/subjectManager';

export const loader$ = new SubjectManager<boolean>();
export const toggle$ = new SubjectManager<boolean>();
export const isOpenModal$ = new SubjectManager<boolean>();
export const isOpenCardRegisterUser$ = new SubjectManager<boolean>();
export const isOpenCardGenerateReport$ = new SubjectManager<boolean>();
export const isOpenCardRegisteProject$ = new SubjectManager<any>();
export const isTaskInformation$ = new SubjectManager<boolean>();
export const errorToken$ = new SubjectManager();
