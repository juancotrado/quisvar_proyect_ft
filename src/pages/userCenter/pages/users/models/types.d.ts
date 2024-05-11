import { Profession } from '../../../../../types';

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
export interface SpecialtiesSelect {
  id: numnber;
  label: string;
  value: string;
}
export interface UserForm {
  id: number;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
  degree: string;
  address: string;
  department: string;
  room: string;
  gender: string;
  userPc: string;
  province: string;
  district: string;
  roleId: number | null;
  ruc: string;
  job: Profession;
  offices: OfficeSelect[];
  cv: FileList | null;
  firstNameRef: string;
  lastNameRef: string;
  phoneRef: string;
  description?: string;
  userPc: string;
  addressRef: string;
  declaration: FileList | null;
  role: Role | null;
  roleName: string;
}
