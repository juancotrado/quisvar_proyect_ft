import { UserRoleType } from '../types/types';

export const assitant_perms: UserRoleType[] = [
  'ADMIN',
  'SUPER_ADMIN',
  'ASSISTANT',
];

export const roleList_SUPER_ADMIN = [
  { id: 'SUPER_ADMIN', value: 'GERENTE GENERAL' },
  { id: 'ADMIN', value: 'GERENTE' },
  { id: 'ASSISTANT', value: 'ASISTENTE DE GENERENCIA' },
  { id: 'SUPER_MOD', value: 'COORD GENERAL' },
  { id: 'MOD', value: 'COORDINADOR' },
  { id: 'EMPLOYEE', value: 'EMPLEADO' },
];
export const roleList_ADMIN = [
  { id: 'ADMIN', value: 'GERENTE' },
  { id: 'ASSISTANT', value: 'ASISTENTE DE GENERENCIA' },
  { id: 'SUPER_MOD', value: 'COORD GENERAL' },
  { id: 'MOD', value: 'COORDINADOR' },
  { id: 'EMPLOYEE', value: 'EMPLEADO' },
];
export const roleList_ASSISTANT = [
  { id: 'ASSISTANT', value: 'ASISTENTE DE GENERENCIA' },
  { id: 'SUPER_MOD', value: 'COORD GENERAL' },
  { id: 'MOD', value: 'COORDINADOR' },
  { id: 'EMPLOYEE', value: 'EMPLEADO' },
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
