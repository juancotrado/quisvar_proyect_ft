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
  },
  regularProcedure: {
    category: 'DIRECT',
    title: 'Nuevo tramite Regular',
    accessTo: 'tramite-regular',
    addUsersText: '+Cc',
  },
  payProcedure: {
    category: 'NORMAL',
    title: 'tramite-de-pago',
    accessTo: '',
    addUsersText: '+Cc',
  },
};
