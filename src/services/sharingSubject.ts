import SubjectManager from '../models/subjectManager';
import {
  AreaSpecialty,
  AttendanceRange,
  Contract,
  Equipment,
  ProjectType,
  Specialists,
  SubTask,
  TrainingSpecialty,
  WorkStation,
  licenseList,
} from '../types/types';

interface CardRegisteProject {
  isOpen: boolean;
  typeSpecialityId: number | null;
  project?: ProjectType;
}
interface CardRegisteContract {
  isOpen: boolean;
  contract?: Contract;
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
  type?: string;
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
interface OpenEspecialistExperienceDescription {
  isOpen: boolean;
  id: number;
  data?: AreaSpecialty;
}
interface OpenEspecialistTrainingDescription {
  isOpen: boolean;
  id: number;
  data?: TrainingSpecialty;
}
interface OpenAssignCard {
  isOpen: boolean;
  id: number;
  data?: Equipment;
}
interface CardWorkStationProps {
  isOpen: boolean;
  data?: WorkStation;
}
interface OpenAddGroup {
  isOpen: boolean;
  id: number;
}
interface OpenAddCompany {
  isOpen: boolean;
  id: number;
}
interface OpenCardCompanies {
  isOpen: boolean;
  id?: number;
}
interface OpenCardConsortium {
  isOpen: boolean;
  id?: number;
}
export const loader$ = new SubjectManager<boolean>();
export const toggle$ = new SubjectManager<boolean>();
export const isOpenModal$ = new SubjectManager<boolean>();
export const isGenerateExcelReport$ = new SubjectManager<string>();
export const isOpenCardRegisterUser$ = new SubjectManager<boolean>();
export const isOpenCardAddEquipment$ =
  new SubjectManager<CardWorkStationProps>();
export const isOpenCardAssing$ = new SubjectManager<OpenAssignCard>();
export const isOpenCardAddGroup$ = new SubjectManager<OpenAddGroup>();
export const isOpenCardAddCompany$ = new SubjectManager<OpenAddCompany>();
export const isOpenCardGenerateReport$ = new SubjectManager<boolean>();
export const isOpenCardCompany$ = new SubjectManager<OpenCardCompanies>();
export const isOpenCardConsortium$ = new SubjectManager<OpenCardConsortium>();
export const isOpenCardSpecialist$ = new SubjectManager<CardSpecialistProps>();
export const isOpenCardViewPdf$ = new SubjectManager<CardViewProps>();
export const isOpenCardFiles$ = new SubjectManager<boolean>();
export const isOpenAddExperience$ =
  new SubjectManager<OpenEspecialistExperienceDescription>();
export const isOpenAddTraining$ =
  new SubjectManager<OpenEspecialistTrainingDescription>();
export const isOpenButtonDelete$ = new SubjectManager<OpenButtonDelete>();
export const isOpenCardLicense$ = new SubjectManager<CardLicenseProps>();
export const isOpenViewDocs$ = new SubjectManager<boolean>();
export const isOpenCardRegisteProject$ =
  new SubjectManager<CardRegisteProject>();
export const isOpenCardRegisteContract$ =
  new SubjectManager<CardRegisteContract>();
export const isOpenCardRegisteTask$ = new SubjectManager<CardRegisteTask>();
export const isTaskInformation$ = new SubjectManager<boolean>();
export const errorToken$ = new SubjectManager();
export const isResizing$ = new SubjectManager<boolean>();
