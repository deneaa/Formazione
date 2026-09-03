import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  private auth = inject(AuthService);
  private router = inject(Router);

  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';

  onSubmit(): void {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Parolele nu coincid.';
      return;
    }

    const result = this.auth.register({
      username: this.username,
      email: this.email,
      password: this.password,
    });

    if (result.success) {
      this.router.navigate(['/']);
    } else {
      this.errorMessage = result.message ?? 'Eroare la înregistrare.';
    }
  }
}
