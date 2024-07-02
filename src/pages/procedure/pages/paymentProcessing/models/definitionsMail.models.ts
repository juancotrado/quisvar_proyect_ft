import { MessageStatus } from '../../../../../types';

export const TYPE_STATUS: Record<MessageStatus, string> = {
  PROCESO: 'PROCESO',
  RECHAZADO: 'RECHAZADO',
  PENDIENTE: 'PENDIENTE',
  ARCHIVADO: 'ARCHIVADO',
  FINALIZADO: 'PROCESO',
  GUARDADO: 'GUARDADO',
  POR_PAGAR: 'POR_PAGAR',
  PAGADO: 'PAGADO',
  OBSERVADO: 'OBSERVADO',
};
export const TYPE_STATUS_REGULAR_PROCEDURE: Record<MessageStatus, string> = {
  ...TYPE_STATUS,
  FINALIZADO: 'FINALIZADO',
};

export const TYPE_PROCEDURE = {
  comunication: {
    category: 'GLOBAL',
    title: 'Nuevo comunicado',
    addUsersText: '+ Destinatario',
    accessTo: 'comunicado',
    provied: 'mail',
    idSubmenu: 3,
    idName: 'messageId',
    previewPdf: 'seal-message',
  },
  regularProcedure: {
    category: 'DIRECT',
    title: 'Nuevo tramite Regular',
    accessTo: 'tramite-regular',
    provied: 'mail',
    addUsersText: '+Cc',
    idSubmenu: 2,
    idName: 'messageId',
    previewPdf: 'seal-message',
  },
  payProcedure: {
    category: 'NORMAL',
    provied: 'payMail',
    title: 'tramite-de-pago',
    accessTo: '',
    addUsersText: '+Cc',
    idSubmenu: 1,
    idName: 'paymessageId',
    previewPdf: 'seal-paymessage',
  },
};
