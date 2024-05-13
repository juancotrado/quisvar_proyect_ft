export const TYPE_STATUS = {
  PROCESO: 'PROCESO',
  PENDIENTE: 'PENDIENTE',
  RECHAZADO: 'RECHAZADO',
  ARCHIVADO: 'ARCHIVADO',
  FINALIZADO: 'PROCESO',
  GUARDADO: 'GUARDADO',
  POR_PAGAR: 'POR PAGAR',
  PAGADO: 'PAGADO',
};
export const TYPE_STATUS_REGULAR_PROCEDURA = {
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
