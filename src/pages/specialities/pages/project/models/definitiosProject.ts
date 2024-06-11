import { TypeTask } from '../../../../../types';

export const PROJECT_OPTIONS = [
  {
    id: 1,
    text: 'DATOS GENERALES',
    iconOn: 'ntbook-blue',
    iconOff: 'ntbook-black',
    navigation: 'detalles',
  },
  {
    id: 2,
    text: 'HOJA DE PRESUPUESTOS',
    iconOn: 'spread-blue',
    iconOff: 'spread-black',
    navigation: 'presupuestos',
  },
  {
    id: 3,
    text: 'BÁSICOS',
    iconOn: 'brief-blue',
    iconOff: 'brief-black',
    navigation: 'basicos',
  },
];

export const OPTION_PROJECT = {
  basic: {
    modalTask: 'basictasks' as TypeTask,
    addTask: 'client:add-task-basic',
    editTask: 'client:edit-task-basic',
    deleteTask: 'client:delete-task-basic',
  },
  normal: {
    modalTask: 'subtasks' as TypeTask,
    addTask: 'client:add-task-normal',
    editTask: 'client:edit-task-normal',
    deleteTask: 'client:delete-task-normal',
  },
};
