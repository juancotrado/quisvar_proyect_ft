import { Degree } from '../../../types';

export type MailTypeProcedure = 'RECEIVER' | 'SENDER' | 'ARCHIVER';

export interface ToData {
  name: string;
  degree: Degree;
  position: string;
}
