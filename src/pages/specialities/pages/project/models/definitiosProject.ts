import { TypeTask } from '../../../../../types';
// import { TaskPermission, TaskRole } from './types';

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
    loadTask: 'client:load-basic-task',
    addTask: 'client:add-task-basic',
    editTask: 'client:edit-task-basic',
    deleteTask: 'client:delete-task-basic',
    dupplicateTask: 'client:duplicate-task-basic',
    addUppeOrLowerTask: 'client:upper-or-lower-task-basic',
    uploadFile: '/files/basics',
  },
  budget: {
    modalTask: 'subtasks' as TypeTask,
    loadTask: 'client:load-budget-task',
    addTask: 'client:add-task-budget',
    editTask: 'client:edit-task-budget',
    deleteTask: 'client:delete-task-budget',
    dupplicateTask: 'client:duplicate-task-budget',
    addUppeOrLowerTask: 'client:upper-or-lower-task-budget',
    uploadFile: '/files/uploads',
  },
};

export enum TaskRole {
  EVALUADOR = 'EVALUADOR',
  TECNICO = 'TECNICO',
}

export enum TaskPermission {
  DELETE_UPLOAD_MODELS = 'DELETE_UPLOAD_MODELS',
  VIEW_ASSIGN_TASK = 'VIEW_ASSIGN_TASK',
  ASSIGN_USER_TASK = 'ASSIGN_USER_TASK',
  ASSIGN_EVALUATOR_TASK = 'ASSIGN_EVALUATOR_TASK',
  RESET_TASK = 'RESET_TASK',
  VIEW_DELIVERABLES = 'VIEW_DELIVERABLES',
  DELETE_UPLOAD_DELIVERABLES = 'DELETE_UPLOAD_DELIVERABLES',
  SEND_FOR_REVIEW = 'SEND_FOR_REVIEW',
  VIEW_LOADER = 'VIEW_LOADER',
  VIEW_PERCENTAGE = 'VIEW_PERCENTAGE',
  EDIT_PERCENTAGE = 'EDIT_PERCENTAGE',
  REVIEW_TASKS = 'REVIEW_TASKS',
  VIEW_INPUT_FEEDBACK = 'VIEW_INPUT_FEEDBACK',
  VIEW_INFO_FEEDBACK = 'VIEW_INFO_FEEDBACK',

  SUBMIT_TASKS = 'SUBMIT_TASKS',
  VIEW_SUBMITTALS = 'VIEW_SUBMITTALS',
  UPLOAD_SUBMITTALS = 'UPLOAD_SUBMITTALS',
  VIEW_MODELS = 'VIEW_MODELS',
  VIEW_PROGRESS = 'VIEW_PROGRESS',
  INTERACT_WITH_PROGRESS = 'INTERACT_WITH_PROGRESS',
  CORRECT = 'CORRECT',
  MARK_REVIEWED = 'MARK_REVIEWED',
}

export enum TaskStatus {
  UNRESOLVED = 'UNRESOLVED',
  PROCESS = 'PROCESS',
  INREVIEW = 'INREVIEW',
  DENIED = 'DENIED',
  REVIEWED = 'REVIEWED',
  // REVIEWED = 'REVIEWED',
  DONE = 'DONE',
  LIQUIDATION = 'LIQUIDATION',
}

const {
  DELETE_UPLOAD_MODELS,
  VIEW_ASSIGN_TASK,
  ASSIGN_USER_TASK,
  RESET_TASK,
  ASSIGN_EVALUATOR_TASK,
  DELETE_UPLOAD_DELIVERABLES,
  VIEW_DELIVERABLES,
  SEND_FOR_REVIEW,
  VIEW_LOADER,
  VIEW_PERCENTAGE,
  EDIT_PERCENTAGE,
  REVIEW_TASKS,
  VIEW_INPUT_FEEDBACK,
  VIEW_INFO_FEEDBACK,
} = TaskPermission;

export enum FeedbackType {
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  HOLDING = 'HOLDING',
}

export const taskLoaderText: Partial<Record<TaskStatus, string>> = {
  [TaskStatus.PROCESS]: 'Esperando entregables...',
  [TaskStatus.REVIEWED]: 'Finalización en proceso',
  [TaskStatus.DENIED]: 'Esperando corrección...',
  [TaskStatus.INREVIEW]: 'Revisión en proceso...',
};

export const taskRolePermissions: Record<
  TaskRole,
  Partial<Record<TaskStatus, TaskPermission[]>>
> = {
  [TaskRole.EVALUADOR]: {
    [TaskStatus.UNRESOLVED]: [
      DELETE_UPLOAD_MODELS,
      VIEW_ASSIGN_TASK,
      RESET_TASK,
      ASSIGN_USER_TASK,
      ASSIGN_EVALUATOR_TASK,
    ],
    [TaskStatus.PROCESS]: [
      DELETE_UPLOAD_MODELS,
      RESET_TASK,
      ASSIGN_EVALUATOR_TASK,
      VIEW_LOADER,
    ],
    [TaskStatus.INREVIEW]: [
      DELETE_UPLOAD_MODELS,
      RESET_TASK,
      ASSIGN_EVALUATOR_TASK,
      VIEW_PERCENTAGE,
      EDIT_PERCENTAGE,
      REVIEW_TASKS,
      VIEW_DELIVERABLES,
      VIEW_INPUT_FEEDBACK,
    ],
    [TaskStatus.DENIED]: [
      DELETE_UPLOAD_MODELS,
      RESET_TASK,
      ASSIGN_EVALUATOR_TASK,
      VIEW_LOADER,
      VIEW_INFO_FEEDBACK,
    ],
    [TaskStatus.REVIEWED]: [
      DELETE_UPLOAD_MODELS,
      RESET_TASK,
      ASSIGN_EVALUATOR_TASK,
      VIEW_LOADER,
      VIEW_INFO_FEEDBACK,
    ],
  },
  [TaskRole.TECNICO]: {
    [TaskStatus.UNRESOLVED]: [VIEW_ASSIGN_TASK],
    [TaskStatus.PROCESS]: [
      DELETE_UPLOAD_DELIVERABLES,
      VIEW_DELIVERABLES,
      SEND_FOR_REVIEW,
      VIEW_PERCENTAGE,
      EDIT_PERCENTAGE,
    ],
    [TaskStatus.INREVIEW]: [VIEW_LOADER, VIEW_PERCENTAGE, VIEW_DELIVERABLES],
    [TaskStatus.DENIED]: [
      DELETE_UPLOAD_DELIVERABLES,
      VIEW_DELIVERABLES,
      SEND_FOR_REVIEW,
      VIEW_PERCENTAGE,
      EDIT_PERCENTAGE,
      VIEW_INFO_FEEDBACK,
    ],
    [TaskStatus.REVIEWED]: [
      DELETE_UPLOAD_DELIVERABLES,
      VIEW_DELIVERABLES,
      SEND_FOR_REVIEW,
      VIEW_PERCENTAGE,
      EDIT_PERCENTAGE,
      VIEW_INFO_FEEDBACK,
    ],
  },
  // [TaskRole.TECNICO]: [TaskPermission.SUBMIT_TASKS],
};
