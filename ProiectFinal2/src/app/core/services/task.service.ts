import { Injectable, computed, inject } from '@angular/core';
import { Task, TaskCategory, TaskPriority, TaskStatus } from '../models/task.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private authService = inject(AuthService);

  readonly tasks = computed(() => this.authService.currentUser()?.tasks ?? []);

  createTask(
    title: string,
    category: TaskCategory,
    priority: TaskPriority,
    description?: string,
  ): Task | null {
    const user = this.authService.currentUser();

    if (!user) {
      return null;
    }

    const now = new Date().toISOString();

    const task: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      category,
      priority,
      status: 'Active',
      createdAt: now,
      updatedAt: now,
    };

    const updatedUser = {
      ...user,
      tasks: [...user.tasks, task],
    };

    this.authService.updateCurrentUser(updatedUser);

    return task;
  }

  getTasks(): Task[] {
    return this.tasks();
  }

  getTasksByStatus(status: TaskStatus): Task[] {
    return this.tasks().filter((task) => task.status === status);
  }

  completeTask(id: string): void {
    const user = this.authService.currentUser();

    if (!user) {
      return;
    }

    const updatedTasks = user.tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            status: 'Completed' as TaskStatus,
            completedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        : task,
    );

    this.authService.updateCurrentUser({
      ...user,
      tasks: updatedTasks,
    });
  }

  deleteTask(id: string): void {
    const user = this.authService.currentUser();

    if (!user) {
      return;
    }

    const updatedTasks = user.tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            status: 'Deleted' as TaskStatus,
            deletedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        : task,
    );

    this.authService.updateCurrentUser({
      ...user,
      tasks: updatedTasks,
    });
  }

  updateTask(id: string, changes: Partial<Task>): void {
    const user = this.authService.currentUser();

    if (!user) {
      return;
    }

    const updatedTasks = user.tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            ...changes,
            updatedAt: new Date().toISOString(),
          }
        : task,
    );

    this.authService.updateCurrentUser({
      ...user,
      tasks: updatedTasks,
    });
  }
}
