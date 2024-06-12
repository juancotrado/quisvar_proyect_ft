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
    dupplicateTask: 'client:duplicate-task-basic',
    addUppeOrLowerTask: 'client:upper-or-lower-task-basic',
  },
  budget: {
    modalTask: 'subtasks' as TypeTask,
    addTask: 'client:add-task-budget',
    editTask: 'client:edit-task-budget',
    deleteTask: 'client:delete-task-budget',
    dupplicateTask: 'client:duplicate-task-budget',
    addUppeOrLowerTask: 'client:upper-or-lower-task-budget',
  },
};
