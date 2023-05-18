export interface TaskType {
  id: number;
  name: string;
  projectId: number;
  status?: string;
  employees?: employees[];
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
interface employees {
  assignedAt: string;
}
export interface TaskCreateType {
  project_id: number;
  name: string;
  description: string;
}
