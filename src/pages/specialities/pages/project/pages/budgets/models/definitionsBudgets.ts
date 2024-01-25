import { StatusType } from '../../../../../../../types';

export type SubTaskForm = {
  id: number | null;
  name: string;
  description?: string;
  days: number;
};
export const COST_DATA = [
  {
    key: 'graduate',
    value: 'Egresado',
  },
  {
    key: 'intern',
    value: 'Practicante',
  },
  {
    key: 'bachelor',
    value: 'Bachiller',
  },
  {
    key: 'professional',
    value: 'Titulado',
  },
];

export const FILTER_OPTIONS: StatusType[] = [
  'UNRESOLVED',
  'PROCESS',
  'INREVIEW',
  'DENIED',
  'DONE',
  'LIQUIDATION',
];

export const STATUS_TEXT = {
  UNRESOLVED: 'POR HACER',
  PROCESS: 'HACIENDO',
  INREVIEW: 'EN REVISIÓN',
  DENIED: 'POR CORREGIR',
  DONE: 'HECHO',
  LIQUIDATION: 'LIQUIDADO',
};
