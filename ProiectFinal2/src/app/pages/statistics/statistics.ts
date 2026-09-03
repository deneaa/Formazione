import { Component, computed, inject } from '@angular/core';
import { TaskService } from '../../core/services/task.service';

@Component({
  imports: [],
  selector: 'app-statistics',
  styleUrl: './statistics.css',
  templateUrl: './statistics.html',
})
export class Statistics {
  private taskService = inject(TaskService);

  private now = new Date();
  private year = this.now.getFullYear();
  private month = this.now.getMonth();

  private thisMonthTasks = computed(() =>
    this.taskService.getTasks().filter((t) => {
      const d = new Date(t.createdAt);
      return d.getFullYear() === this.year && d.getMonth() === this.month && t.status !== 'Deleted';
    }),
  );

  totalTasks = computed(() => this.thisMonthTasks().length);

  completedTasks = computed(() => this.thisMonthTasks().filter((t) => t.status === 'Completed').length);

  completionPercent = computed(() => {
    const total = this.totalTasks();
    return total === 0 ? 0 : Math.round((this.completedTasks() / total) * 100);
  });

  totalHours = computed(() =>
    this.thisMonthTasks().reduce((sum, t) => sum + (t.estimatedHours || 0), 0),
  );

  completedHours = computed(() =>
    this.thisMonthTasks()
      .filter((t) => t.status === 'Completed')
      .reduce((sum, t) => sum + (t.estimatedHours || 0), 0),
  );

  daysWithoutTasks = computed(() => {
    const daysInMonth = new Date(this.year, this.month + 1, 0).getDate();
    const daysUpToToday = this.now.getDate();

    const daysWithTasks = new Set(
      this.thisMonthTasks().map((t) => new Date(t.createdAt).getDate()),
    );

    let count = 0;
    for (let day = 1; day <= daysUpToToday; day++) {
      if (!daysWithTasks.has(day)) count++;
    }
    return count;
  });

  // circumferința cercului SVG pentru graficul circular
  circleDashArray = 2 * Math.PI * 45;

  circleDashOffset(): number {
    const percent = this.completionPercent();
    return this.circleDashArray - (this.circleDashArray * percent) / 100;
  }
}
