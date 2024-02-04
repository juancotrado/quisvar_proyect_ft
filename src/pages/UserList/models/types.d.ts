export interface SwornDeclaration {
  declarations?: string[];
  typeDeclaration?: 'technical' | 'administrative';
  declarationDate: string;
}
export interface ContractUser {
  numberContract: number;
  professionalService: string;
  contractualAmount: number;
  date: Date;
}
