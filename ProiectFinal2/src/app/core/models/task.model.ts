export interface Task {
  id: string;
  title: string;
  description?: string;

  priority: TaskPriority;
  status: TaskStatus;
  category: TaskCategory;

  estimatedHours: number;

  createdAt: string;
  updatedAt: string;

  completedAt?: string;
  deletedAt?: string;
}

export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Active' | 'Completed' | 'Deleted';
export type TaskCategory = 'Personal' | 'Work' | 'Study' | 'Health & Fitness' | 'Finance' | 'Others';

export const PRIORITIES: TaskPriority[] = ['High', 'Medium', 'Low'];
export const CATEGORIES: TaskCategory[] = ['Personal', 'Work', 'Study', 'Health & Fitness', 'Finance', 'Others'];
