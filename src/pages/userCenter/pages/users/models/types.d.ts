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
