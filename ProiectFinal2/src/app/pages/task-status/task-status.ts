import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TaskService } from '../../core/services/task.service';
import { Task, TaskStatus as TaskStatusType } from '../../core/models/task.model';
import { DatePipe } from '@angular/common';

@Component({
  imports: [RouterLink, DatePipe],
  selector: 'app-task-status',
  styleUrl: './task-status.css',
  templateUrl: './task-status.html',
})
export class TaskStatus {
  private route = inject(ActivatedRoute);
  private taskService = inject(TaskService);

  status = signal<TaskStatusType>('Completed');

  constructor() {
    const param = this.route.snapshot.paramMap.get('status');
    this.status.set(param === 'deleted' ? 'Deleted' : 'Completed');
  }

  isDeleted(): boolean {
    return this.status() === 'Deleted';
  }

  tasks = computed(() =>
    [...this.taskService.getTasksByStatus(this.status())].sort((a, b) => {
      const dateA = this.isDeleted() ? a.deletedAt : a.completedAt;
      const dateB = this.isDeleted() ? b.deletedAt : b.completedAt;
      return (dateB ?? '').localeCompare(dateA ?? '');
    }),
  );

  reactivate(task: Task): void {
    this.taskService.reactivateTask(task.id);
  }

  durationDays(task: Task): number {
    const end = this.isDeleted() ? task.deletedAt : task.completedAt;
    if (!end) return 0;
    const ms = new Date(end).getTime() - new Date(task.createdAt).getTime();
    return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
  }

  daysLeftToPurge(task: Task): number {
    if (!task.deletedAt) return 0;
    const elapsed = Date.now() - new Date(task.deletedAt).getTime();
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
    return Math.max(0, Math.ceil((THIRTY_DAYS - elapsed) / (1000 * 60 * 60 * 24)));
  }
}
