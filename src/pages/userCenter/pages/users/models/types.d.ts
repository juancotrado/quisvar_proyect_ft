export interface SwornDeclaration {
  declarations?: string[];
  typeDeclaration?: 'technical' | 'administrative';
  declarationDate: Date;
  declarationMonths: number;
}
export interface ContractUser {
  professionalLevel: 1 | 2 | 3;
  date: Date;
  month: number;
  projectNumber: number;
}
export interface OfficeSelect {
  id: numnber;
  label: string;
  quantity?: number;
  value: string;
}
