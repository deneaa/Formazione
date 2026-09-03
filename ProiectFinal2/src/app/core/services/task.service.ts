import { Injectable, computed, inject } from '@angular/core';
import { Task, TaskCategory, TaskPriority, TaskStatus } from '../models/task.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private authService = inject(AuthService);

  readonly tasks = computed(() => this.purgeExpired(this.authService.currentUser()?.tasks ?? []));

  createTask(
    title: string,
    category: TaskCategory,
    priority: TaskPriority,
    estimatedHours: number,
    description?: string,
  ): Task | null {
    const user = this.authService.currentUser();
    if (!user) return null;

    const now = new Date().toISOString();

    const task: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      category,
      priority,
      estimatedHours,
      status: 'Active',
      createdAt: now,
      updatedAt: now,
    };

    this.authService.updateCurrentUser({ ...user, tasks: [...user.tasks, task] });
    return task;
  }

  getTasks(): Task[] {
    return this.tasks();
  }

  getTasksByStatus(status: TaskStatus): Task[] {
    return this.tasks().filter((t) => t.status === status);
  }

  completeTask(id: string): void {
    this.patchTask(id, {
      status: 'Completed',
      completedAt: new Date().toISOString(),
    });
  }

  reactivateTask(id: string): void {
    this.patchTask(id, { status: 'Active', completedAt: undefined });
  }

  deleteTask(id: string): void {
    this.patchTask(id, {
      status: 'Deleted',
      deletedAt: new Date().toISOString(),
    });
  }

  changePriority(id: string, priority: TaskPriority): void {
    this.patchTask(id, { priority });
  }

  updateTask(id: string, changes: Partial<Task>): void {
    this.patchTask(id, changes);
  }

  private patchTask(id: string, changes: Partial<Task>): void {
    const user = this.authService.currentUser();
    if (!user) return;

    const updatedTasks = user.tasks.map((task) =>
      task.id === id ? { ...task, ...changes, updatedAt: new Date().toISOString() } : task,
    );

    this.authService.updateCurrentUser({ ...user, tasks: updatedTasks });
  }

  private purgeExpired(tasks: Task[]): Task[] {
    const now = Date.now();
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

    return tasks.filter((t) => {
      if (t.status !== 'Deleted' || !t.deletedAt) return true;
      return now - new Date(t.deletedAt).getTime() < THIRTY_DAYS;
    });
  }
}
