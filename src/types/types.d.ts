import { OfficeSelect, Reception } from '../pages/procedure/models';

export interface SpecialityType {
  id: number;
  name: string;
  cod: string;
  createdAt: Date;
  typeSpecialities?: TypeSpecialities[];
}
export interface DataUser {
  id: number;
  name: string;
  percentage?: number;
  status?: boolean;
}
export interface GeneralFile {
  id: number;
  name: string;
  dir: string;
  createdAt: string;
}
export interface TypeSpecialities {
  id: number;
  name: string;
  cod: string;
  projects: ProjectType[];
  _count?: {
    projects: number;
  };
}
interface Schedule {
  title: string;
  initDate: string;
  finishDate: string;
}
export interface ServiceOrderForm {
  concept: string;
  amount: string;
  payType: string;
  acountNumber: string;
  acountCheck: string;
  company: CompanySelect;
  ordenNumber: number;
}
export interface ServiceOrderData extends ServiceOrderForm {
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
  degree: string;
  description: string;
  ruc: string;
  address: string;
  // companyName: string;
  // companyRuc: string;
  title: string;
}
export interface ReportForm {
  initialDate: string;
  untilDate: string;
  concept: string;
  porcentageValue: number;
  title: string;
}

export interface OfficeGeneral {
  officeId: number;
  office: OfficeClass;
}

export interface OfficeClass {
  id: number;
  name: string;
}
export interface Office {
  id: number;
  name: string;
  quantity: number;
  manager?: UserProfile;
  users: UserElement[];
  _count: {
    users: number;
  };
}

export interface UserElement {
  user: UserProfile;
  isOfficeManager: boolean;
}

export interface UserProfile {
  id: number;
  ruc: null | string;
  address: string;
  profile: Profile;
  office?: string;
}

export interface ProfileOffice {
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
  degree: string;
  description: string;
  job: string;
}

export interface ExcelData extends ReportForm {
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
  totalDays: number;
  degree: string;
}
export interface DataSidebarSpeciality {
  id: number;
  name: string;
  cod?: string;
  CUI?: string;
  specialities?: SpecialityType[];
  typeSpecialities?: TypeSpecialities[];
  projects?: ProjectType[];
  sectors?: SectorType[];
}

export interface ProjectReport {
  id: number;
  moderator: {
    profile: {
      firstName: string;
      lastName: number;
    };
  };
  name: string;
  CUI: string;
  description: string;
  subtasks: SubTask[];
  district: string;
  percentage: number;
}
export interface SectorType {
  id: number;
  name: string;
  specialities: SpecialityType[];
}
export interface GroupProject {
  id: number;
  projects: ProjectType[];
}

export interface TaskType {
  id: number;
  name: string;
  projectId: number;
  status?: string;
  employees: Employees[];
  project?: {
    name: string;
  };
  subtasks?: SubTaskType[];
}
interface SubTaskType {
  createdAt: Date;
  description?: string;
  hours: number;
  id: number;
  name: string;
  price: number;
  taskId: number;
  updatedAt: Date;
  status?: string;
  employees: Employees[];
}
interface Employees {
  user: {
    profile: {
      firstName?: string;
      userId?: number;
    };
  };
}
export interface TaskCreateType {
  project_id: number;
  name: string;
  description: string;
}

export type Users = {
  percentage: number;
  assignedAt: Date;
  untilDate: Date;
  user: User;
  status: boolean;
};

export interface FileInfo {
  lastModified?: number; // Optional due to browser-specific behavior
  lastModifiedDate?: Date; // Optional due to browser-specific behavior
  name: string;
  size: number;
  type: string;
  webkitRelativePath?: string; // Optional due to browser-specific behavior
}
export interface FilesSubtask {
  id: string;
  name: string;
  size: number;
}
export type typeSidebarSpecility =
  | 'sector'
  | 'specialities'
  | 'typespecialities'
  | 'projects';

// export type UserRoleType =
//   | 'SUPER_ADMIN'
//   | 'ADMIN'
//   | 'ASSISTANT'
//   | 'ASSISTANT_ADMINISTRATIVE'
//   | 'SUPER_MOD'
//   | 'MOD'
//   | 'EMPLOYEE';

export interface GruopProject {
  id: number;
  projects: ProjectType[];
}

export interface MenuItem {
  id: number;
  route: MenuAccess;
  title: string;
  typeRol: string;
  menu: MenuItem[];
}

interface RoleForm {
  id: number;
  name: string;
}
interface Role extends RoleForm {
  menuPoints: MenuItem[];
}

export type MenuAccess =
  | 'home'
  | 'tramites'
  | 'especialidades'
  | 'asistencia'
  | 'centro-de-usuarios'
  | 'empresas'
  | 'especialistas'
  | 'indice-general'
  | 'grupos';

export interface User {
  id: number;
  email: string;
  password: string;
  profile: Profile;
  role: Role | null;
  roleId: number;
  status?: boolean;
  contract: string | null;
  cv: string | null;
  declaration: string | null;
  isAccessReception: boolean;
  offices: OfficeGeneral[];
  withdrawalDeclaration: string | null;
  ruc: string;
  address: string;
  equipment?: {
    id: number;
    name: string;
    doc: string;
    description: string;
    userId: number;
    workStationId: number;
    workStation: WorkStation;
  };
}

export interface UserSelect extends User {
  value: string;
  label: string;
}
export type Degree =
  | 'Practicante'
  | 'Egresado'
  | 'Bachiller'
  | 'Titulado'
  | 'Magister';
type Profile = {
  id: number;
  degree: Degree;
  description: string;
  job: Profession;
  firstName: string;
  firstNameRef: string;
  lastNameRef: string;
  phoneRef: string;
  addressRef: string;
  lastName: string;
  dni: string;
  phone: string;
  userPc: string;
  userId: number;
  department: string;
  province: string;
  district: string;
  room: string;
  userPc: string;
  gender: string;
};
export type RangeDate = {
  startDate: string;
  endDate: string;
};
export interface ProjectType {
  id: number;
  name: string;
  stage?: Stage;
  stages: StageSubtask[];
  specialityId: number;
  userId: number;
  hasAccessInStage: boolean;
  useSessionId: number;
}

export interface InfoDataReport {
  department: string;
  district: string;
  province: string;
  initialDate: string;
  finishDate: string;
  moderatorName: string;
  projectName: string;
  cui: string;
}

interface Stages {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  projectId: number;
  startDate: string;
  untilDate: string;
}
type AreasType = {
  id: number;
  name: string;
};

export interface ProjectForm {
  id?: number;
  CUI: string;
  name: string;
  description: string;
  department: string;
  province: string;
  district: string;
  contractId: number;
  typeSpecialityId: number | null;
  isDuplicate: boolean;
}
export type ContractType =
  | 'CONTRATO'
  | 'ORDEN_DE_SERVICIO'
  | 'CONTRATACION_DIRECTA';
export interface ContractForm {
  id?: number;
  cui: string;
  name: string;
  contractNumber: string;
  projectName: string;
  department: string;
  municipality: string;
  province: string;
  district: string;
  type: ContractType;
  difficulty: 1 | 2 | 3;
  projectShortName: string;
  createdAt: string | null;
  indexContract: string;
  idCoorp: string;
  amount: number;
}

interface StageForm {
  bachelorCost: number;
  professionalCost: number;
  graduateCost: number;
  internCost: number;
  groupId: number;
}

type DegreType = 'professional' | 'bachelor';

interface Contract extends ContractForm {
  id: number;
  number: number;
  companyId: number | null;
  consortiumId: number | null;
  consortium: ConsortiumType;
  company: Companies;
  isIndependent: boolean;
  details: string | null;
  phases: string;
  observations: string;
}

export interface WorkArea {
  id: number;
  name: string;
  userId: number;
  item?: string;
  user: User;
  projectId: number;
  indexTasks: IndexTask[];
  project: ProjectType;
}
export type WorkAreaForm = Omit<WorkArea, 'indexTasks' | 'user' | 'project'>;

export interface DataTask {
  id: number;
  unique?: boolean;
  item?: string;
  name: string;
  subTasks: SubTask[];
}
export interface IndexTask extends DataTask {
  tasks: Task[];
}
export interface Task extends DataTask {
  tasks_2: Task2[];
  _count?: { subTasks: number };
}

export interface Task2 extends DataTask {
  tasks_3: DataTask[];
}
export type TypeFileUser =
  | 'contract'
  | 'cv'
  | 'declaration'
  | 'withdrawalDeclaration';

// export interface SubTask {
//   id: number;
//   name: string;
// }
export interface SubTask {
  id: number;
  status: StatusType;
  name: string;
  item?: string;
  feedBacks: Feedback[];
  percentage: number;
  description: string;
  untilDate?: string;
  price: string;
  days: number;
  files: Files[];
  createdAt?: Date;
  updatedAt?: Date;
  taskId: number;
  indexTaskId: number;
  Levels: {
    userId: number;
    stages: StageSubtask;
  };
  task_2_Id: number;
  task_3_Id: number;
  users: Users[];
  assignedAt?: string;
  createdAt?: Date;
}

interface CoorpEntity {
  id: number;
  name: string;
  type: string;
  newId: string;
  urlImg: string;
}
export interface Feedback {
  id: number;
  comment: string | null;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  subTasksId: number;
  percentage: number;
  files: Files[];
  users: UserFeedback[];
}

interface UserFeedback {
  userId: number;
  feedbackId: number;
  userMain: boolean;
  assignedAt: string;
  user: {
    id: number;
    profile: Profile;
  };
}
export interface DataFeedback {
  id: number;
  comment: string;
}

type StatusType =
  | 'UNRESOLVED'
  | 'PROCESS'
  | 'INREVIEW'
  | 'DENIED'
  | 'DONE'
  | 'LIQUIDATION';

type AddTask = 'upper' | 'lower';

export type TypeTask = 'subtasks' | 'basictasks';
export type OptionProject = 'basic' | 'normal';
export interface SubtaskIncludes extends SubTask {
  Levels: {
    stages: {
      id: number;
      projectId: number;
    };
  };
}

interface ContractIndexData {
  id: string;
  name: string;
  nivel: number;
  hasFile?: 'yes' | 'no';
  uploadDate?: Date;
  deliverLettersId?: id;
  nextLevel?: ContractIndexData[];
}

type FileType = 'MODEL' | 'UPLOADS' | 'REVIEW';
interface Files {
  id: number;
  name: string;
  userId: number;
  dir: string;
  type: FileType;
  subTasksId: number;
}
export interface AreaForm {
  projectId: number;
  userId: number;
  name: string;
}

export interface ArchiverOptions {
  name: string;
  fn: () => void;
  icon: string;
}
export interface Level {
  id: number;
  item: string;
  name: string;
  rootId: number;
  level: number;
  spending: number;
  balance: number;
  price: number;
  isArea: false;
  isInclude: false;
  isProject: true;
  stagesId: number;
  details: Details;
  subTasks: SubTask[];
  userId: number;
  projectName?: string;
  nextLevel?: Level[];
  percentage: number;
  total: number;
  days: number;
  rootTypeItem: TypeItem;
  user?: {
    id: number;
    profile: {
      firstName: string;
      lastName: string;
      dni: string;
    };
  };
  listUsers: ListUsers[];
}

export interface ListUsers {
  userId: number;
  count: number;
  firstName: string;
  lastName: string;
  dni: string;
}
interface Details {
  UNRESOLVED: number;
  PROCESS: number;
  INREVIEW: number;
  DENIED: number;
  DONE: number;
  LIQUIDATION: number;
  TOTAL: number;
}

interface ReviewListIndexTask {
  id: number;
  item: string;
  name: string;
  workArea: {
    id: number;
    item: string;
    name: string;
    project: {
      name: string;
    };
  };
}
interface ReviewListTask {
  id: number;
  item: string;
  name: string;
  indexTask: ReviewListIndexTask;
}
interface ReviewListTask2 {
  id: number;
  item: string;
  name: string;
  task: ReviewListTask;
}
interface ReviewListTask3 {
  id: number;
  item: string;
  name: string;
  task_2: ReviewListTask2;
}

export interface ReviewList {
  id: number;
  name: string;
  item: string;
  status: string;
  task: ReviewListTask | null;
  indexTask: ReviewListIndexTask | null;
  task_lvl_2: ReviewListTask2 | null;
  task_lvl_3: ReviewListTask3 | null;
  users: {
    user: User;
  }[];
}
export interface Option {
  name: string;
  type: 'button' | 'submit' | 'reset' | undefined;
  icon: string;
  function?: () => void;
}

export interface Stage {
  id: number;
  name: string;
  startDate: string;
  untilDate: string;
}
interface StageSubtask extends Stage {
  group: Groups;
}
export interface StageInfo extends StageForm, Stage {
  startDate: string;
  untilDate: string;
  status: boolean;
  isProject: boolean;
  moderatorId: null | number;
  rootTypeItem: string;
  group: Groups;
  createdAt: string;
  updatedAt: string;
  projectId: number;
  project: {
    contract: Contract;
  };
}
interface Groups {
  id: number;
  name: string;
  groups: { users: User }[];
  moderator: User;
}
export interface Ubigeo {
  id_ubigeo: string;
  nombre_ubigeo: string;
  codigo_ubigeo: string;
  etiqueta_ubigeo: string;
  buscador_ubigeo: string;
  numero_hijos_ubigeo: string;
  nivel_ubigeo: string;
  id_padre_ubigeo: string;
}
export interface PersonalBussines {
  dni: string;
  phone: string;
  name: string;
  cip: number;
  career: string;
  pdf: string;
}
export interface Companyes {
  maneger: string;
  name: string;
  ruc: string;
  percentage: number;
}

export type CompanyType = {
  id: number;
  ruc: string;
  name: string;
  manager: string;
  percentage?: number;
};

export type ConsortiumType = {
  id: number;
  img?: string;
  manager: string;
  name: string;
  companies: SubCompany[];
  img: string;
};
export interface ConsortiumTypeForm extends ConsortiumType {
  img: FileList;
}
type SubCompany = {
  companies: Pick<Companies, 'id' | 'name' | 'img'>;
  percentaje?: string;
};
export type ExpertType = {
  id: number;
  career: string;
  name: string;
  phone: string;
  cip: number;
  dni: string;
  pdf?: string;
};

export interface ProjectDetailsPrice extends DetailsPrice {
  areas: AreaDetailsPrice[];
}

export interface AreaDetailsPrice extends DetailsPrice {
  item: string;
  indexTasks: IndexTasksDetailsPrice[];
}
export interface IndexTasksDetailsPrice extends DetailsPrice {
  item: string;
  tasks: TasksDetailsPrice[];
  subTasks: DetailsSubtasks[];
}
export interface TasksDetailsPrice extends DetailsPrice {
  item: string;
  tasks_2: Tasks_lvl_2DetailsPrice[];
  subTasks: DetailsSubtasks[];
}
export interface Tasks_lvl_2DetailsPrice extends DetailsPrice {
  item: string;
  tasks_3: Tasks_lvl_3DetailsPrice[];
  subTasks: DetailsSubtasks[];
}
export interface Tasks_lvl_3DetailsPrice extends DetailsPrice {
  item: string;
  subTasks: DetailsSubtasks[];
}
interface DetailsPrice {
  balance: number;
  item?: string;
  id: number;
  name: string;
  price: number;
  spending: number;
  taskInfo: TypeTaskInfoDetails;
}

interface DetailsSubtasks {
  id: number;
  balance: number;
  description?: string;
  item: string;
  name: string;
  percentage: number;
  price: string;
  spending: number;
  status: string;
  users: {
    percentage: number;
    user: {
      id: number;
      profile: {
        dni: string;
        firstName: string;
        lastName: string;
        phone: string;
      };
    };
  }[];
}

export type TypeTaskInfoDetails = {
  DENIED: number;
  DONE: number;
  INREVIEW: number;
  LIQUIDATION: number;
  PROCESS: number;
  TOTAL: number;
  UNRESOLVED: number;
};
export type CompanyForm = Omit<CompanyType, 'id'>;
export type ConsortiumForm = Omit<ConsortiumType, 'id'>;
export type ExpertForm = Omit<ExpertType, 'id'>;

export type StatusReport = 'DECLINE' | 'PROCESS' | 'DONE';
export type StageReport = 'STEP_1' | 'STEP_2' | 'STEP_3' | 'STEP_4';
export interface ListReport {
  id: number;
  name: string;
  status: StatusReport;
  stage: StageReport;
  // createdAt: Date;
  user: { id: number; profile: Profile };
  supervisor: { comments: string | undefined; status: StatusReport };
}
export interface userList {
  usersId: number;
  listId: number;
  status: string;
  assignedAt: string;
}
export interface ListAttendance {
  createdAt: string;
  id: number;
  title: string;
  timer: string;
  users: userList[];
}
export interface userAttendance {
  status: string;
  usersId: number;
  list: {
    createdAt: string;
    title: string;
    timer: string;
    id: number;
  };
}
export interface UserAttendance {
  PUNTUAL: number;
  TARDE: number;
  SIMPLE: number;
  GRAVE: number;
  MUY_GRAVE: number;
  PERMISO: number;
}
export interface AttendanceRange {
  id: number;
  role: UserRoleType;
  equipment: {
    name: string;
    workStationId: number;
    workStation: WorkStation;
  };
  profile: {
    firstName: string;
    lastName: string;
    dni: string;
    phone: string;
    room: string;
    userPc: string;
  };
  list: userAttendance[];
}

interface MailOrigin {
  type: MessageSender;
  status: boolean;
}
export interface MailType extends MailOrigin {
  paymessageId: number;
  paymessage: MessageType;
}

export interface PayMailNumeration {
  mailList: MailType[];
  total: number;
}

export interface ReceptionMailNumeration {
  mailList: Reception[];
  total: number;
}
export interface MailTypeComunication extends MailOrigin {
  messageId: number;
  message: MessageType;
}
export interface MailGeneral extends MailOrigin {
  messageId: number;
  message: MessageType;
}

export interface MailGeneralNumeration {
  mailList: MailGeneral[];
  total: number;
}
export type MessageSender =
  | 'SENDER'
  | 'RECEIVER'
  | 'LICENSE'
  | 'RECEPTION'
  | 'ARCHIVER';
export type MessageStatus =
  | 'PROCESO'
  | 'RECHAZADO'
  | 'ARCHIVADO'
  | 'FINALIZADO'
  | 'GUARDADO'
  | 'POR_PAGAR'
  | 'PAGADO'
  | 'PENDIENTE';

export type MessageTypeImbox =
  | 'INFORME'
  | 'CARTA'
  | 'MEMORANDUM'
  | 'ACUERDO'
  | 'OFICIO'
  | 'COORDINACION';
export interface MessageType {
  id: number;
  title: string;
  isOpen: boolean;
  description: string;
  createdAt: Date;
  header: string;
  onHolding: boolean;
  initialSender: userMessage;
  filesPay: {
    files: fileMesage[];
  }[];
  beforeOffice: string;
  office: Office;
  files?: fileMesage[];
  status: MessageStatus;
  users: userMessage[];
  type: MessageTypeImbox;
  updatedAt: Date;
  history: MessageReply[];
  voucher?: string;
  paymentPdfData: string;
  userInit: userMessage;
}

export type ProfileShort = Pick<
  Profile,
  'firstName' | 'lastName' | 'dni' | 'phone' | 'job'
>;
export interface MessageReply {
  id: number;
  title: string;
  isOpen: boolean;
  description: string;
  // type: MessageTypeImbox;
  createdAt: Date;
  header: string;
  files?: fileMesage[];
  user: {
    id: number;
    profile: ProfileShort;
  };
}
export interface PdfGeneratorPick {
  id: number;
  title: string;
  isOpen: boolean;
  description: string;
  createdAt: Date;
  header: string;
  files?: fileMesage[];
  updatedAt?: Date;
  users?: userMessage[];
  user?: {
    id: number;
    profile: ProfileShort;
  };
  history?: MessageReply[];
}
export interface userMessage {
  type: MessageSender;
  status: boolean;
  role: 'MAIN' | 'SECONDARY';
  user: {
    id: number;
    ruc: string;
    address: string;
    profile: Profile;
  };
  userId: number;
}
export interface fileMesage {
  id: number;
  attempt: string;
  name: string;
  path: string;
}

export type quantityType = {
  type: MessageType['type'];
  _count: { type: number };
};
type receiverType = { id: number; value: string };
interface MessageSendType {
  title: string;
  header: string;
  description?: string;
  receiver?: Contact;
  secondaryReceiver?: Contact[];
  signature: boolean;
  type: MessageType['type'];
}
export interface Procedure extends MessageSendType {
  officeId?: number;
  receiverId?: number;
  secondaryReceiver?: {
    userId: number;
  }[];
}

export interface ProcedureSubmit {
  values: Procedure;
  fileUploadFiles: File[];
  mainFile: blob;
}
type ListItemElement = {
  type: 'listItem';
  content: string;
};
export type ElementType =
  | {
      type: 'paragraph';
      content: string;
    }
  | {
      type: 'table';
      data: string[][];
    }
  | {
      type: 'orderedList';
      items: ListItemElement[];
    }
  | {
      type: 'unorderedList';
      items: ListItemElement[];
    };
export interface ListUserExtend extends Omit<User, 'profile'> {
  name: string;
  degree: string;
  position: string;
}
export interface ListUser {
  name: string;
  degree: string;
  position: string;
}
export type PdfDataProps = {
  title: string;
  from: string;
  to: string;
  cc?: ListUser[];
  header: string;
  date: string;
  body: ElementType[];
  dni?: string;
  tables?: (string | undefined)[][];
  fromDegree?: string;
  toDegree?: string;
  toPosition?: string;
  fromPosition?: string;
};
type licenseStatus =
  | 'PROCESO'
  | 'ACEPTADO'
  | 'ACTIVO'
  | 'INACTIVO'
  | 'DENEGADO';
type listDetails =
  | 'PUNTUAL'
  | 'TARDE'
  | 'SIMPLE'
  | 'GRAVE'
  | 'MUY_GRAVE'
  | 'PERMISO'
  | 'SALIDA';
export type licenseList = {
  id: number;
  usersId: number;
  supervisorId?: number;
  reason?: string;
  checkout?: string;
  feedback?: string;
  type?: string;
  status: licenseStatus;
  fine?: listDetails;
  startDate: string;
  untilDate: string;
  createdAt: string;
};
export interface Option {
  name?: string;
  icon?: string;
  url?: string;
  function?: () => void;
  type?: 'button' | 'reset' | 'submit';
}
export type getLicenses = {
  id: number;
  // status: licenseStatus;
  usersId: number;
  type: string;
};
export interface Companies {
  id: number;
  name: string;
  ruc: string;
  color: string;
  phone: string;
  email: string;
  manager: string;
  address: string;
  departure: string;
  inscription?: Date | string;
  activities?: Date | string;
  SEE?: Date | string;
  CCI: string;
  img?: string;
  description: string;
  orderQuantity: number;
}
export interface CompaniesForm extends Companies {
  img: FileList;
}
export interface MenuMoreInfo {
  id: number;
  name: string;
  icon: string;
  action: () => void;
}
// export type CompanySelect = Companies & OptionSelect;
export interface CompanySelect extends Companies, OptionSelect {}
export type SpecialistProject = {
  id: number;
  specialistId: number;
  projectId: number;
  project: ProjectType;
};
type Tuition = 'CAP' | 'CIP' | 'CCP';
export type Specialists = {
  id: number;
  dni: string;
  firstName: string;
  lastName: string;
  phone: string;
  career: string;
  degree: string;
  agreementFile: FileList | null;
  cvFile: FileList | null;
  price: string;
  tuition: Tuition;
  inscriptionDate: string;
  inscription: string;
  email: string;
  projects: SpecialistProject[];
};
export type SpecialistList = {
  id: number;
  dni: string;
  firstName: string;
  lastName: string;
};
export type AreaSpecialty = {
  id: number;
  institution: string;
  startDate: Date;
  untilDate: Date;
  file: string;
  specialistId: number;
};
export type TrainingSpecialty = {
  id: number;
  institution: string;
  hours: string;
  issue: Date | string;
  startDate: Date | string;
  untilDate: Date | string;
  trainingFile: string;
  specialistId: number;
};
export type Experience = {
  id: number;
  listSpecialities: {
    name: string;
  };
  areaSpecialtyName: AreaSpecialty[];
};
export type Training = {
  id: number;
  trainingName: string;
  trainingSpecialistName: TrainingSpecialty[];
};
export type TrainingName = {
  trainingName: string;
  specialistId: number;
};
export type AreaSpecialtyName = {
  specialtyName: OptionSelect;
  specialistId: number;
};

export interface RangeDays {
  day: number;
  participant: string;
}
export interface WorkStation {
  id: number;
  name: string;
  total: number;
  doc: string;
  description: string;
  price: string;
  equipment: Equipment[];
}
export interface Equipment {
  id: number;
  name: string;
  doc: string;
  description: string;
  userId: number;
  workStationId: number;
  user?: {
    id: number;
    profile: {
      firstName: string;
      lastName: string;
      dni: string;
      userPc: string;
    };
  };
}

export interface UserGroup {
  users: {
    id: number;
    profile: {
      firstName: string;
      lastName: string;
      userPc: string;
    };
    role: UserRoleType;
  };
  mod: boolean;
}
export interface Group {
  id: number;
  name: string;
  gNumber: number;
  groups?: UserGroup[];
}

interface Groups extends Group {
  groups: { users: User }[];
}

export type MenuRole = 'MOD' | 'MEMBER' | 'VIEWER';

export interface Menu {
  id: number;
  title: string;
  route: string;
  access: MenuRole[];
  menu?: Menu[];
}
export interface MenuPoint {
  id?: number;
  menuId: number;
  typeRol: MenuRole;
  subMenuPoints?: MenuPoint[];
}
interface RelationMenuPoint {
  [key: number]: MenuPoint[];
}

export interface MenuRoleForm extends Menu {
  idRelation?: number;
  typeRol: MenuRole;
  menu?: MenuRoleForm[];
}
export interface Roles {
  id: number;
  name: string;
  menuPoints: MenuRoleForm[];
  menuPointsDb: MenuPoint[];
}

export interface OptionSelect {
  id?: number;
  value: string;
  label: string;
}

export type StylesVariant = 'primary' | 'secondary' | 'tertiary';

export interface Profession extends OptionSelect {
  abrv: string;
  amount: number;
}
export interface DataLicense {
  reason: string;
  startDate: string;
  untilDate: string;
  type: string;
}
export interface PaginationTable {
  pageIndex: number;
  pageSize: number;
}
export interface CompaniesSelect extends Companies {
  value: string;
  label: string;
}
