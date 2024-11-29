export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  COMPLETED = 'COMPLETED'
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export enum ProjectPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface User {
  id: string;
  name: string | null;
  email: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date | null;
  createdAt: Date;
  updatedAt?: Date;
  project: {
    id: string;
    name: string;
  };
  assignee: User;
  tags: Tag[];
}

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  status: any; // Changed type to any
  priority: ProjectPriority;
  createdAt: Date;
  updatedAt?: Date;
  tasks: Task[];
  users: User[];
}

export interface TaskFilters {
  assignee?: string;
  priority?: TaskPriority;
  tags: string[];
  searchQuery: string;
}

export interface TaskSort {
  field: 'dueDate' | 'priority' | 'title';
  direction: 'asc' | 'desc';
}
