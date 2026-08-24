import { Task } from './task.model';

export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  tasks: Task[];
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}
