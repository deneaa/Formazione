import { Component, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LucideChevronDown, LucideChevronUp } from '@lucide/angular';

import { Purchase } from '../../core/models';
import { ProductService } from '../../core/services/product.service';
import { ExportService } from '../../core/services/export.service';

@Component({
  selector: 'app-purchase-card',
  imports: [DatePipe, LucideChevronDown, LucideChevronUp],
  templateUrl: './purchase-card.html',
  styleUrl: './purchase-card.css',
})
export class PurchaseCard {
  private productService = inject(ProductService);
  private exportService = inject(ExportService);

  purchase = input.required<Purchase>();

  isOpen = signal(false);

  toggleDropdown(): void {
    this.isOpen.update((value) => !value);
  }

  getNameById(productId: string): string {
    return this.productService.getNameById(productId);
  }

  getPriceById(productId: string): number {
    return this.productService.getPriceById(productId);
  }

  exportData(purchase: Purchase): void {
    this.exportService.exportPurchaseToPdf(purchase);
  }
}
