import { MessageStatus, MessageTypeImbox } from '../../../types';

export const LIST_TYPE_MSG: { id: MessageTypeImbox }[] = [
  { id: 'ACUERDO' },
  { id: 'CARTA' },
  { id: 'COORDINACION' },
  { id: 'INFORME' },
  { id: 'MEMORANDUM' },
  { id: 'OFICIO' },
];

export const LIST_STATUS_MSG: { id: MessageStatus }[] = [
  { id: 'ARCHIVADO' },
  { id: 'FINALIZADO' },
  { id: 'GUARDADO' },
  { id: 'PROCESO' },
  { id: 'RECHAZADO' },
];

export const RADIO_OPTIONS = [
  { id: 'CARTA', value: 'CARTA' },
  { id: 'INFORME', value: 'INFORME' },
  { id: 'MEMORANDUM', value: 'MEMORANDUM' },
  { id: 'ACUERDO', value: 'ACUERDO' },
  { id: 'OFICIO', value: 'OFICIO' },
  { id: 'COORDINACION', value: 'COORDINACION' },
];

export const YEAR = new Date().getFullYear();
