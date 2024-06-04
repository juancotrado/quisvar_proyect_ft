import {
  AddTask,
  AreaSpecialty,
  AttendanceRange,
  Contract,
  Equipment,
  OfficeClass,
  Profession,
  Specialists,
  SubTask,
  TrainingSpecialty,
  User,
  WorkStation,
  licenseList,
} from '../types/types';

interface OpenModal {
  isOpen: boolean;
}
export interface OpenWithId extends OpenModal {
  id?: number;
}
export interface ViewPdf extends OpenModal {
  pdfComponentFunction?: JSX.Element;
  pdfBlob?: Blob;
  pdfUrl?: string;
  fileNamePdf: string;
}
export interface ViewHtmlToPdf extends OpenModal {
  htmlString?: string;
  pdfBlob?: Blob;
  fileNamePdf: string;
  size?: 'a4' | 'a5';
}
export interface CardRegisteProject {
  isOpen: boolean;
  typeSpecialityId: number | null;
  isDuplicate: boolean;
  idProject?: number;
}
export interface CardObservations extends OpenModal {
  observations: string;
}
export interface CardRegisteContract extends OpenModal {
  contract?: Contract;
}
export interface CardRegisteTask extends OpenModal {
  levelId: number | null;
  task?: SubTask;
  type?: AddTask;
  typeTask: 'subtasks' | 'basictasks';
}
export interface CardViewProps extends OpenModal {
  data: AttendanceRange[];
  daily?: string;
  rangeDate?: { startDate: string; endDate: string };
  typeReport: 'range' | 'daily';
}
export interface CardLicenseProps extends OpenModal {
  type?: string;
  data?: licenseList;
}
export interface OpenCardFiles extends OpenModal {
  isAdmin?: boolean;
}
export interface ViewRegisterUser extends OpenModal {
  user?: User;
  roles: RoleForm[];
}
export interface CardSpecialistProps extends OpenModal {
  data?: Specialists;
  function?: () => void;
}
export interface OpenConfirmAction extends OpenModal {
  function: () => void;
}

export interface OpenEspecialistExperienceDescription extends OpenModal {
  id: number;
  data?: AreaSpecialty;
}
export interface OpenEspecialistTrainingDescription extends OpenModal {
  id: number;
  data?: TrainingSpecialty;
}
export interface OpenProfessionCard extends OpenModal {
  data?: Profession;
}
export interface OpenOfficeCard extends OpenModal {
  data?: OfficeClass;
}
export interface OpenAssignCard extends OpenModal {
  id: number;
  data?: Equipment;
}
export interface CardWorkStationProps extends OpenModal {
  data?: WorkStation;
}

export interface OpenViewDocs extends OpenModal {
  user: User;
}
