import { Component, computed, inject } from '@angular/core';
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

  cartCount = computed(() => {
    const user = this.auth.currentUser();
    if (!user) return 0;
    return user.cart.reduce((sum, item) => sum + item.quantity, 0);
  });
}
