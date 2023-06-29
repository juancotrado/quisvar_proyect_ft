import { IndexTask } from './types.d';
export interface SpecialityType {
  id: number;
  name: string;
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
  user: User;
};

export type fyleType = 'MATERIAL' | 'SUCCESSFUL' | 'REVIEW';

export type User = {
  id: number;
  email: string;
  password: string;
  profile: Profile;
  role?: string;
  status?: boolean;
};
type Profile = {
  id: number;
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
  unique?: boolean;
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
  specialityId: number;
  unique?: boolean;
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
  project: {
    name: string;
  };
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

// export interface SubTask {
//   id: number;
//   name: string;
// }
export interface SubTask {
  id: number;
  status: string;
  name: string;
  item?: string;
  percentage: number;
  description: string;
  price: string;
  hours: number;
  files: Files[];
  createdAt?: Date;
  updatedAt?: Date;
  taskId: number;
  users: Users[];
  createdAt?: Date;
}

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

interface Files {
  id: number;
  name: string;
  userId: number;
  user: User;
  dir: string;
  type: string;
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
