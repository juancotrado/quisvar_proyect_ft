import { IndexTask, FileInfo } from './types.d';
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
export interface ReportForm {
  initialDate: string;
  untilDate: string;
  concept: string;
  remote: string;
  title: string;
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

export type UserRoleType =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'ASSISTANT'
  | 'SUPER_MOD'
  | 'MOD'
  | 'EMPLOYEE';

export interface GruopProject {
  id: number;
  projects: ProjectType[];
}
export type User = {
  id: number;
  email: string;
  password: string;
  profile: Profile;
  role: UserRoleType;
  status?: boolean;
  contract: string | null;
  cv: string | null;
  declaration: string | null;
};
type Profile = {
  id: number;
  firstName: string;
  degree: string;
  description: string;
  job: string;
  lastName: string;
  dni: string;
  phone: string;
  userId: number;
};
export type RangeDate = {
  startDate: string;
  endDate: string;
};
export interface ProjectType {
  id: number;
  description?: string;
  location?: string;
  CUI: string;
  name: string;
  unique?: boolean;
  status: boolean;
  typeSpeciality: string;
  company?: CompanyType;
  consortium?: ConsortiumType;
  stage?: Stage;
  startDate: Date;
  untilDate: Date;
  moderator: {
    profile: Profile;
  };
  _count: {
    tasks: number;
  };
  stages: Stages[];
  userId?: number;
  areas: AreasType[];
  specialityId: number;
  unique?: boolean;
  department: string;
  province: string;
  district: string;
  specialists?: PersonalBussines[];
}

interface Stages {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  projectId: number;
}
type AreasType = {
  id: number;
  name: string;
};

export type ProjectForm = Omit<
  ProjectType,
  'areas' | '_count' | 'moderator' | 'startDate' | 'untilDate'
> & { startDate: string | Date; untilDate: string | Date };

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
export type TypeFileUser = 'contract' | 'cv' | 'declaration';

// export interface SubTask {
//   id: number;
//   name: string;
// }
export interface SubTask {
  id: number;
  status: StatusType;
  name: string;
  item?: string;
  feedBacks: feedBacks[];
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
  };
  task_2_Id: number;
  task_3_Id: number;
  users: Users[];
  assignedAt?: string;
  createdAt?: Date;
}
export interface Feedback {
  id: number;
  comment: string | null;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  subTasksId: number;
  files: Files[];
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

export type TypeTask = 'task' | 'indextask' | 'task2' | 'task3';
export interface SubtaskIncludes extends SubTask {
  task: {
    id: number;
    indexTask: {
      id: number;
      workAreaId: number;
    };
  };
  indexTask: {
    id: number;
    workAreaId: number;
  };
  task_lvl_2: {
    id: number;
    task: {
      id: number;
      indexTask: {
        id: number;
        workAreaId: number;
      };
    };
  };
  task_lvl_3: {
    id: number;
    task_2: {
      id: number;
      task: {
        id: number;
        indexTask: {
          id: number;
          workAreaId: number;
        };
      };
    };
  };
}

type FileType = 'MODEL' | 'UPLOADS' | 'REVIEW';
interface Files {
  id: number;
  name: string;
  userId: number;
  user: User;
  dir: string;
  type: FileType;
  subTasksId: number;
}
export interface AreaForm {
  projectId: number;
  userId: number;
  name: string;
}

export interface UserForm {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
  degree: string;
  description: string;
  job: string;
  cv: FileList | null;
  declaration: FileList | null;
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
  nextLevel?: NextLevel[];
  percentage: number;
  total: number;
  days: number;
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
  manager: string;
  name: string;
  companies: CompanyForm[];
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
  users: userList[];
}
export interface userAttendance {
  status: string;
  usersId: number;
  list: {
    createdAt: string;
    title: string;
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
  profile: {
    firstName: string;
    lastName: string;
    dni: string;
    phone: string;
  };
  list: userAttendance[];
}

export interface MailType {
  messageId: number;
  status: boolean;
  type: MessageSender;
  message: MessageType;
}
export type MessageSender = 'SENDER' | 'RECEIVER';
export type MessageStatus =
  | 'PROCESO'
  | 'RECHAZADO'
  | 'ARCHIVADO'
  | 'FINALIZADO'
  | 'GUARDADO';
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
  files?: fileMesage[];
  status: MessageStatus;
  users: userMessage[];
  type: MessageTypeImbox;
  updatedAt: Date;
  history: MessageReply[];
}
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
    profile: Pick<Profile, 'firstName' | 'lastName' | 'dni' | 'phone'>;
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
    profile: Pick<Profile, 'firstName' | 'lastName' | 'dni' | 'phone'>;
  };
  history?: MessageReply[];
}
export interface userMessage {
  type: MessageSender;
  status: boolean;
  role: 'MAIN' | 'SECONDARY';
  user: {
    id: number;
    profile: Pick<
      Profile,
      'firstName' | 'lastName' | 'dni' | 'phone' | 'degree' | 'description'
    >;
  };
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
  receiverId: number;
  type: MessageType['type'];
}
export type ElementType =
  | {
      type: 'paragraph';
      content: string;
    }
  | {
      type: 'table';
      data: string[][];
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
