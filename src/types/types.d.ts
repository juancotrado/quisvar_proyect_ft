export interface SpecialityType {
  id: number;
  name: number;
  _count?: {
    projects: number;
  };
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
  id: number;
  email: string;
  password: string;
  profile: Profile;
  role?: string;
  status?: boolean;
};
type Profile = {
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
  userId: number;
};
export interface ProjectType {
  id: number;
  description?: string;
  name: string;
  status: boolean;
  typeSpeciality: string;
  startDate: Date;
  untilDate: Date;
  moderator: {
    profile: Profile;
  };
  _count: {
    tasks: number;
  };
  userId?: number;
  areas: AreasType[];
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
  projectId: number;
  indexTasks: IndexTask[];
}

export interface IndexTask {
  id: number;
  name: string;
  tasks: Task[];
}

export interface Task {
  id: number;
  name: string;
  subTasks: SubTask[];
}

// export interface SubTask {
//   id: number;
//   name: string;
// }
export interface SubTask {
  id: number;
  status: string;
  name: string;
  percentage: number;
  description: string;
  price: string;
  hours: number;
  createdAt?: Date;
  updatedAt?: Date;
  taskId: number;
  users: any[];
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
}
