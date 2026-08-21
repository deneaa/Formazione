import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LucideChevronDown, LucideChevronUp } from '@lucide/angular';

import { Purchase } from '../../../core/models';
import { ProductService } from '../../../core/services/product.service';
import { ExportService } from '../../../core/services/export.service';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

@Component({
  selector: 'app-purchase-card',
  imports: [DatePipe, LucideChevronDown, LucideChevronUp, ClickOutsideDirective],
  templateUrl: './purchase-card.html',
  styleUrl: './purchase-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseCard {
  private productService = inject(ProductService);
  private exportService = inject(ExportService);

  purchase = input.required<Purchase>();

  isOpen = signal(false);

  toggleDropdown(): void {
    this.isOpen.update((value) => !value);
  }

  closeDropdown(): void {
    this.isOpen.set(false);
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
