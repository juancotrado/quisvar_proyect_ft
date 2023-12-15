import { UserRoleType } from '../types/types';

export const rolsFirstLevel: UserRoleType[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'ASSISTANT',
];

export const attendance_perms: UserRoleType[] = [
  ...rolsFirstLevel,
  'ASSISTANT_ADMINISTRATIVE',
];
export const rolSecondLevel: UserRoleType[] = [...rolsFirstLevel, 'SUPER_MOD'];

export const rolThirdLevel: UserRoleType[] = [...rolSecondLevel, 'MOD'];

export const roleList_ASSISTANT = [
  { id: 'ASSISTANT', value: 'ASISTENTE DE GERENCIA' },
  { id: 'ASSISTANT_ADMINISTRATIVE', value: 'ASISTENTE DE ADMINISTRACION' },
  { id: 'SUPER_MOD', value: 'COORD GENERAL' },
  { id: 'MOD', value: 'COORDINADOR' },
  { id: 'EMPLOYEE', value: 'TECNICO' },
];
export const roleList_ADMIN = [
  { id: 'ADMIN', value: 'GERENTE' },
  ...roleList_ASSISTANT,
];
export const roleList_SUPER_ADMIN = [
  { id: 'SUPER_ADMIN', value: 'GERENTE GENERAL' },
  ...roleList_ADMIN,
];
export const getListByRole = (role: UserRoleType) => {
  if (role === 'SUPER_ADMIN') return roleList_SUPER_ADMIN;
  if (role === 'ADMIN') return roleList_ADMIN;
  return roleList_ASSISTANT;
};

export const verifyByRole = (role: UserRoleType, sessionRole: UserRoleType) => {
  if (['SUPER_ADMIN'].includes(role) && sessionRole === 'ADMIN') return false;
  if (['SUPER_ADMIN', 'ADMIN'].includes(role) && sessionRole === 'ASSISTANT')
    return false;
  return true;
};
