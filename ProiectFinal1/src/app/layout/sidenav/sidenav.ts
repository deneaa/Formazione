import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideHouse, LucideShoppingBag, LucideShoppingCart, LucideUser, LucideSettings } from '@lucide/angular';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidenav',
  imports: [RouterLink, RouterLinkActive, LucideHouse, LucideShoppingBag, LucideShoppingCart, LucideUser, LucideSettings],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.css',
})
export class Sidenav {
  auth = inject(AuthService);
}
