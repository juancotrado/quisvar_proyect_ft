export type ContractType =
  | 'ORDEN_DE_SERVICIO'
  | 'CONTRATO'
  | 'CONTRATACION_DIRECTA';

export interface FilterContract {
  date: string;
  type: ContractType | '';
  status: string;
}
