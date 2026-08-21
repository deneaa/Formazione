import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { PurchaseCard } from '../../shared/components/purchase-card/purchase-card';
import { ExportService } from '../../core/services/export.service';
import { Purchase } from '../../core/models';

@Component({
  selector: 'app-profile',
  imports: [PurchaseCard],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  auth = inject(AuthService);
  private exportService = inject(ExportService);

  exportAll(purchases: Purchase[]): void {
    this.exportService.exportPurchasesToPdf(purchases);
  }
}
