export interface Task {
  id: string;
  title: string;
  description?: string;

  priority: TaskPriority;
  status: TaskStatus;
  category: TaskCategory;

  createdAt: Date;
  updatedAt: Date;

  completedAt?: Date;
  deletedAt?: Date;
}

export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Active' | 'Completed' | 'Deleted';
export type TaskCategory = 'Personal' | 'Work' | 'Study' | 'Health & Fitness' | 'Finance' | "Others";
