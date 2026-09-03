import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  errorMessage = '';

  onSubmit(): void {
    const result = this.auth.login({
      username: this.username,
      password: this.password,
    });

    if (result.success) {
      this.router.navigate(['/']);
    } else {
      this.errorMessage = result.message ?? 'Eroare la autentificare.';
    }
  }
}
