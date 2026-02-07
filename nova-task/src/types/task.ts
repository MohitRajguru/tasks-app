export type TaskStatus = 'NEW' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  fullName: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedToId: number | null;
  assignedToName: string | null;
  createdById: number;
  createdByName: string;
  createdDate: string;
  updatedDate: string;
  dueDate: string | null;
}

export interface TaskRequest {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedToId?: number;
  dueDate?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
}
