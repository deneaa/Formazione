import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
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
  imports: [FormsModule, ReactiveFormsModule, RouterLink, DatePipe],
  selector: 'app-tasks',
  styleUrl: './tasks.css',
  templateUrl: './tasks.html',
})
export class Tasks {
  private taskService = inject(TaskService);
  private fb = inject(FormBuilder);

  priorities = PRIORITIES;
  categories = CATEGORIES;

  taskForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    priority: ['Medium' as TaskPriority, Validators.required],
    category: ['Personal' as TaskCategory, Validators.required],
    estimatedHours: [1, [Validators.required, Validators.min(0)]],
    dueDate: [''],
  });

  formModalOpen = signal(false);
  formMode = signal<'add' | 'edit'>('add');
  editingId: string | null = null;

  detailsTask = signal<Task | null>(null);

  searchText = signal('');
  categoryFilter = signal<TaskCategory | 'All'>('All');
  sortBy = signal<SortBy>('date');
  sortDir = signal<SortDir>('desc');

  draggedTaskId: string | null = null;

  private allActive = computed(() => this.taskService.getTasksByStatus('Active'));

  activeCount = computed(() => this.allActive().length);
  completedCount = computed(() => this.taskService.getTasksByStatus('Completed').length);
  deletedCount = computed(() => this.taskService.getTasksByStatus('Deleted').length);
  totalHours = computed(() => this.allActive().reduce((s, t) => s + (t.estimatedHours || 0), 0));

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
    this.formMode.set('add');
    this.editingId = null;
    this.taskForm.reset({
      title: '',
      description: '',
      priority: 'Medium',
      category: 'Personal',
      estimatedHours: 1,
      dueDate: '',
    });
    this.formModalOpen.set(true);
  }

  openEditModal(task: Task): void {
    this.formMode.set('edit');
    this.editingId = task.id;
    this.taskForm.reset({
      title: task.title,
      description: task.description ?? '',
      priority: task.priority,
      category: task.category,
      estimatedHours: task.estimatedHours,
      dueDate: task.dueDate ?? '',
    });
    this.detailsTask.set(null);
    this.formModalOpen.set(true);
  }

  closeFormModal(): void {
    this.formModalOpen.set(false);
  }

  submitForm(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const v = this.taskForm.getRawValue();

    if (this.formMode() === 'add') {
      this.taskService.createTask(
        v.title.trim(),
        v.category,
        v.priority,
        v.estimatedHours,
        v.description.trim() || undefined,
        v.dueDate || undefined,
      );
    } else if (this.editingId) {
      this.taskService.updateTask(this.editingId, {
        title: v.title.trim(),
        description: v.description.trim() || undefined,
        category: v.category,
        priority: v.priority,
        estimatedHours: v.estimatedHours,
        dueDate: v.dueDate || undefined,
      });
    }

    this.closeFormModal();
  }


  openDetails(task: Task): void {
    this.detailsTask.set(task);
  }

  closeDetails(): void {
    this.detailsTask.set(null);
  }

  editFromDetails(task: Task): void {
    this.openEditModal(task);
  }


  complete(task: Task, evt?: Event): void {
    evt?.stopPropagation();
    this.taskService.completeTask(task.id);
    this.detailsTask.set(null);
  }

  remove(task: Task, evt?: Event): void {
    evt?.stopPropagation();
    this.taskService.deleteTask(task.id);
    this.detailsTask.set(null);
  }

  edit(task: Task, evt?: Event): void {
    evt?.stopPropagation();
    this.openEditModal(task);
  }

  daysAgo(dateStr: string): string {
    const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  }

  isOverdue(task: Task): boolean {
    if (!task.dueDate) return false;
    return new Date(task.dueDate).getTime() < Date.now();
  }

  onDragStart(task: Task, evt: DragEvent): void {
    this.draggedTaskId = task.id;
    evt.stopPropagation();
  }

  onDrop(priority: TaskPriority): void {
    if (!this.draggedTaskId) return;
    this.taskService.changePriority(this.draggedTaskId, priority);
    this.draggedTaskId = null;
  }
}
