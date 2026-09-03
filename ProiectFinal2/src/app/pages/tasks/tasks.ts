import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../core/services/task.service';
import {
  Task,
  TaskPriority,
  PRIORITIES,
  TaskCategory,
  CATEGORIES,
} from '../../core/models/task.model';

type SortBy = 'date' | 'priority';
type SortDir = 'asc' | 'desc';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-tasks',
  styleUrl: './tasks.css',
  templateUrl: './tasks.html',
})
export class Tasks {
  private taskService = inject(TaskService);

  priorities = PRIORITIES;
  categories = CATEGORIES;

  modalOpen = signal(false);
  modalMode = signal<'add' | 'edit'>('add');
  editingId: string | null = null;

  formTitle = '';
  formDescription = '';
  formPriority: TaskPriority = 'Medium';
  formCategory: TaskCategory = 'Personal';
  formHours = 1;

  searchText = signal('');
  categoryFilter = signal<TaskCategory | 'All'>('All');
  sortBy = signal<SortBy>('date');
  sortDir = signal<SortDir>('desc');

  draggedTaskId: string | null = null;

  private allActive = computed(() => this.taskService.getTasksByStatus('Active'));

  completedCount = computed(() => this.taskService.getTasksByStatus('Completed').length);
  deletedCount = computed(() => this.taskService.getTasksByStatus('Deleted').length);

  private filteredActive = computed(() => {
    let list = this.allActive();

    const search = this.searchText().toLowerCase().trim();
    if (search) {
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(search) ||
          (t.description ?? '').toLowerCase().includes(search),
      );
    }

    const cat = this.categoryFilter();
    if (cat !== 'All') {
      list = list.filter((t) => t.category === cat);
    }

    const dir = this.sortDir() === 'asc' ? 1 : -1;

    if (this.sortBy() === 'date') {
      list = [...list].sort((a, b) => dir * a.createdAt.localeCompare(b.createdAt));
    } else {
      const order: Record<TaskPriority, number> = { High: 0, Medium: 1, Low: 2 };
      list = [...list].sort((a, b) => dir * (order[a.priority] - order[b.priority]));
    }

    return list;
  });

  tasksByPriority = computed(() => {
    const grouped: Record<TaskPriority, Task[]> = { High: [], Medium: [], Low: [] };
    for (const task of this.filteredActive()) {
      grouped[task.priority].push(task);
    }
    return grouped;
  });

  openAddModal(): void {
    this.modalMode.set('add');
    this.editingId = null;
    this.formTitle = '';
    this.formDescription = '';
    this.formPriority = 'Medium';
    this.formCategory = 'Personal';
    this.formHours = 1;
    this.modalOpen.set(true);
  }

  openEditModal(task: Task): void {
    this.modalMode.set('edit');
    this.editingId = task.id;
    this.formTitle = task.title;
    this.formDescription = task.description ?? '';
    this.formPriority = task.priority;
    this.formCategory = task.category;
    this.formHours = task.estimatedHours;
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
  }

  submitModal(): void {
    const title = this.formTitle.trim();
    if (!title) return;

    if (this.modalMode() === 'add') {
      this.taskService.createTask(
        title,
        this.formCategory,
        this.formPriority,
        this.formHours,
        this.formDescription.trim() || undefined,
      );
    } else if (this.editingId) {
      this.taskService.updateTask(this.editingId, {
        title,
        description: this.formDescription.trim() || undefined,
        category: this.formCategory,
        priority: this.formPriority,
        estimatedHours: this.formHours,
      });
    }

    this.closeModal();
  }

  complete(task: Task): void {
    this.taskService.completeTask(task.id);
  }

  remove(task: Task): void {
    this.taskService.deleteTask(task.id);
  }

  daysAgo(dateStr: string): string {
    const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  }

  onDragStart(task: Task): void {
    this.draggedTaskId = task.id;
  }

  onDrop(priority: TaskPriority): void {
    if (!this.draggedTaskId) return;
    this.taskService.changePriority(this.draggedTaskId, priority);
    this.draggedTaskId = null;
  }
}
