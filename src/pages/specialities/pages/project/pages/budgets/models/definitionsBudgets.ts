import { AddTask, StatusType } from '../../../../../../../types';

export type SubTaskForm = {
  id: number | null;
  name: string;
  description?: string;
  days: number;
  type?: AddTask;
};

export const OPTION_LEVEL_TEXT = {
  duplicate: 'Duplicar nivel',
  upperAdd: 'Agregar nivel arriba',
  edit: 'Editar nivel',
  lowerAdd: 'Agregar nivel abajo',
};
export const COST_DATA = [
  {
    key: 'intern',
    value: 'Practicante',
  },
  {
    key: 'graduate',
    value: 'Egresado',
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
