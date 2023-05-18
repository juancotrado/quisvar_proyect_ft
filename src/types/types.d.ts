export interface TaskType {
  id: number;
  name: string;
  projectId: number;
  status: string;
}
export interface TaskCreateType {
  project_id: number;
  name: string;
  description: string;
}
