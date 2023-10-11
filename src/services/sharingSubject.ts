import SubjectManager from '../models/subjectManager';
import {
  AttendanceRange,
  ProjectType,
  Specialists,
  SubTask,
  licenseList,
} from '../types/types';

interface CardRegisteProject {
  isOpen: boolean;
  typeSpecialityId: number | null;
  project?: ProjectType;
}
interface CardRegisteTask {
  isOpen: boolean;
  levelId: number | null;
  task?: SubTask;
}
interface CardViewProps {
  isOpen: boolean;
  data: AttendanceRange[];
  daily?: string;
  rangeDate?: { startDate: string; endDate: string };
  typeReport: 'range' | 'daily';
}
interface CardLicenseProps {
  isOpen: boolean;
  data?: licenseList;
}
interface CardSpecialistProps {
  isOpen: boolean;
  data?: Specialists;
}
interface OpenButtonDelete {
  isOpen: boolean;
  function: () => void;
}
export const loader$ = new SubjectManager<boolean>();
export const toggle$ = new SubjectManager<boolean>();
export const isOpenModal$ = new SubjectManager<boolean>();
export const isGenerateExcelReport$ = new SubjectManager<string>();
export const isOpenCardRegisterUser$ = new SubjectManager<boolean>();
export const isOpenCardGenerateReport$ = new SubjectManager<boolean>();
export const isOpenCardCompany$ = new SubjectManager<boolean>();
export const isOpenCardSpecialist$ = new SubjectManager<CardSpecialistProps>();
export const isOpenCardViewPdf$ = new SubjectManager<CardViewProps>();
export const isOpenCardFiles$ = new SubjectManager<boolean>();
export const isOpenButtonDelete$ = new SubjectManager<OpenButtonDelete>();
export const isOpenCardLicense$ = new SubjectManager<CardLicenseProps>();
export const isOpenViewDocs$ = new SubjectManager<boolean>();
export const isOpenCardRegisteProject$ =
  new SubjectManager<CardRegisteProject>();
export const isOpenCardRegisteTask$ = new SubjectManager<CardRegisteTask>();
export const isTaskInformation$ = new SubjectManager<boolean>();
export const errorToken$ = new SubjectManager();
