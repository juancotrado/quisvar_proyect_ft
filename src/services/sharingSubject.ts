import { SubjectManager } from '../models';
import {
  CardLicenseProps,
  CardObservations,
  CardRegisteContract,
  CardRegisteProject,
  CardRegisteTask,
  CardSpecialistProps,
  CardViewProps,
  CardWorkStationProps,
  OpenAssignCard,
  OpenConfirmAction,
  OpenEspecialistExperienceDescription,
  OpenEspecialistTrainingDescription,
  OpenViewDocs,
  OpenWithId,
  ViewHtmlToPdf,
  ViewPdf,
  ViewRegisterUser,
} from './types';

export const loader$ = new SubjectManager<boolean>();
export const toggle$ = new SubjectManager<boolean>();
export const isOpenModal$ = new SubjectManager<boolean>();
export const isGenerateExcelReport$ = new SubjectManager<string>();
export const isOpenCardRegisterUser$ = new SubjectManager<ViewRegisterUser>();
export const isOpenCardAddEquipment$ =
  new SubjectManager<CardWorkStationProps>();
export const isOpenCardAssing$ = new SubjectManager<OpenAssignCard>();
export const isOpenCardAddGroup$ = new SubjectManager<OpenWithId>();
export const isOpenCardAddCompany$ = new SubjectManager<OpenWithId>();
export const isOpenCardGenerateReport$ = new SubjectManager<boolean>();
export const isOpenCardCompany$ = new SubjectManager<OpenWithId>();
export const isOpenCardConsortium$ = new SubjectManager<OpenWithId>();
export const isOpenCardSpecialist$ = new SubjectManager<CardSpecialistProps>();
export const isOpenCardViewPdf$ = new SubjectManager<CardViewProps>();
export const isOpenCardFiles$ = new SubjectManager<boolean>();
export const isOpenAddExperience$ =
  new SubjectManager<OpenEspecialistExperienceDescription>();
export const isOpenAddTraining$ =
  new SubjectManager<OpenEspecialistTrainingDescription>();
export const isOpenButtonDelete$ = new SubjectManager<OpenConfirmAction>();
export const isOpenConfirmAction$ = new SubjectManager<OpenConfirmAction>();
export const isOpenCardLicense$ = new SubjectManager<CardLicenseProps>();
export const isOpenViewDocs$ = new SubjectManager<OpenViewDocs>();
export const isOpenCardRegisteProject$ =
  new SubjectManager<CardRegisteProject>();
export const isOpenCardObservations$ = new SubjectManager<CardObservations>();
export const isOpenCardRegisteContract$ =
  new SubjectManager<CardRegisteContract>();
export const isOpenCardRegisteTask$ = new SubjectManager<CardRegisteTask>();
export const isOpenViewPdf$ = new SubjectManager<ViewPdf>();
export const isOpenViewHtmlToPdf$ = new SubjectManager<ViewHtmlToPdf>();
export const isTaskInformation$ = new SubjectManager<boolean>();
export const errorToken$ = new SubjectManager();
export const isResizing$ = new SubjectManager<boolean>();
