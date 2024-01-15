import { StatusType } from '../../../../../../../types';

export const COST_DATA = [
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
