import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TaskService } from '../../core/services/task.service';

@Component({
  imports: [FormsModule],
  selector: 'app-profile',
  styleUrl: './profile.css',
  templateUrl: './profile.html',
})
export class Profile {
  private auth = inject(AuthService);
  private taskService = inject(TaskService);
  private router = inject(Router);

  user = this.auth.currentUser;

  editing = signal(false);
  formUsername = '';
  formEmail = '';
  errorMessage = '';
  successMessage = '';

  totalTasks = computed(() => this.taskService.getTasks().length);
  activeTasks = computed(() => this.taskService.getTasksByStatus('Active').length);
  completedTasks = computed(() => this.taskService.getTasksByStatus('Completed').length);

  startEdit(): void {
    const u = this.user();
    if (!u) return;
    this.formUsername = u.username;
    this.formEmail = u.email;
    this.errorMessage = '';
    this.successMessage = '';
    this.editing.set(true);
  }

  cancelEdit(): void {
    this.editing.set(false);
  }

  save(): void {
    const u = this.user();
    if (!u) return;

    const username = this.formUsername.trim();
    const email = this.formEmail.trim();

    if (username.length < 6) {
      this.errorMessage = 'Username-ul trebuie să aibă minim 6 caractere.';
      return;
    }

    this.auth.updateCurrentUser({ ...u, username, email });
    this.errorMessage = '';
    this.successMessage = 'Profil actualizat.';
    this.editing.set(false);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
