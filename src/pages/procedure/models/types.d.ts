import { Degree, Profession, UserProfile } from '../../../types';

export type MailTypeProcedure = 'RECEIVER' | 'SENDER' | 'ARCHIVER';
export type MailTypeProcedureSpanish = 'RECIBIDOS' | 'ENVIADOS' | 'ARCHIVADOS';
export interface OptionsMailHeader {
  id: number;
  iconOn: string;
  iconOff: string;
  text: MailTypeProcedureSpanish;
  isActive: boolean;
  funcion: () => void;
}
export interface ToData {
  name: string;
  degree: Degree;
  position: string;
  job: Profession;
}

export type TypeProcedure =
  | 'comunication'
  | 'regularProcedure'
  | 'payProcedure';

export interface OfficeSelect {
  value: string;
  label: string;
  manager: UserProfile;
  quantity: number;
  id: number;
  isDisabled?: boolean;
}

export interface userSelect extends UserProfile {
  value: string;
  label: string;
  isDisabled?: boolean;
}
export type Contact = OfficeSelect | userSelect;
