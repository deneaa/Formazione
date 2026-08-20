import { Component, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LucideChevronDown, LucideChevronUp } from '@lucide/angular';

import { Purchase } from '../../core/models';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-purchase-card',
  imports: [DatePipe, LucideChevronDown, LucideChevronUp],
  templateUrl: './purchase-card.html',
  styleUrl: './purchase-card.css',
})
export class PurchaseCard {
  private productService = inject(ProductService);

  purchase = input.required<Purchase>();

  isOpen = signal(false);

  toggleDropdown(): void {
    this.isOpen.update((value) => !value);
  }

  getNameById(productId: string): string {
    return this.productService.getNameById(productId);
  }
}
