import SubjectManager from '../models/subjectManager';
import { DataSidebarSpeciality, SubTask } from '../types/types';

interface CardRegisteProject {
  isOpen: boolean;
  typeSpecialityId: number | null;
  project?: DataSidebarSpeciality;
}
interface CardRegisteTask {
  isOpen: boolean;
  levelId: number | null;
  task?: SubTask;
}

export const loader$ = new SubjectManager<boolean>();
export const toggle$ = new SubjectManager<boolean>();
export const isOpenModal$ = new SubjectManager<boolean>();
export const isGenerateExcelReport$ = new SubjectManager<string>();
export const isOpenCardRegisterUser$ = new SubjectManager<boolean>();
export const isOpenCardGenerateReport$ = new SubjectManager<boolean>();
export const isOpenCardFiles$ = new SubjectManager<boolean>();
export const isOpenViewDocs$ = new SubjectManager<boolean>();
export const isOpenCardRegisteProject$ =
  new SubjectManager<CardRegisteProject>();
export const isOpenCardRegisteTask$ = new SubjectManager<CardRegisteTask>();
export const isTaskInformation$ = new SubjectManager<boolean>();
export const errorToken$ = new SubjectManager();
