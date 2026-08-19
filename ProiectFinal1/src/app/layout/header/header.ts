import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideUser } from '@lucide/angular';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, LucideUser],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  auth = inject(AuthService);

  logout(): void {
    this.auth.logout();
  }
}
