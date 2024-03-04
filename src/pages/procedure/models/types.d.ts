import { Degree } from '../../../types';

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
}

export type TypeProcedure =
  | 'comunication'
  | 'regularProcedure'
  | 'payProcedure';
