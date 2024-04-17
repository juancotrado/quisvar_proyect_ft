import {
  Degree,
  MessageSender,
  MessageStatus,
  MessageTypeImbox,
  Profession,
  Profile,
  UserProfile,
} from '../../../types';

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

export interface Reception {
  id: number;
  header: string;
  status: MessageStatus;
  type: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  onHolding: boolean;
  onHoldingDate: Date;
  users: UserElement[];
}

export interface UserElement {
  type: string;
  role: string;
  status: boolean;
  userInit: boolean;
  user: UserProfile;
}

export interface MessageFunction {
  typeMail?: MessageSender;
  statusMsg?: MessageStatus;
  typeMsg?: MessageTypeImbox;
  skip?: number;
}
