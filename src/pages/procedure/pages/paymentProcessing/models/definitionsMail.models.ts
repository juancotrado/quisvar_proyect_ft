import { UserRoleType } from '../../../../../types';

export const TYPE_STATUS = {
  PROCESO: 'PROCESO',
  RECHAZADO: 'RECHAZADO',
  ARCHIVADO: 'ARCHIVADO',
  FINALIZADO: 'PROCESO',
  GUARDADO: 'GUARDADO',
  POR_PAGAR: 'POR PAGAR',
  PAGADO: 'PAGADO',
};

export const ROLE_PERM: UserRoleType[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'SUPER_MOD',
  'MOD',
];
