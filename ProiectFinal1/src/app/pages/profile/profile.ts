import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { PurchaseCard } from '../../shared/purchase-card/purchase-card';

@Component({
  selector: 'app-profile',
  imports: [PurchaseCard],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  auth = inject(AuthService);
}
