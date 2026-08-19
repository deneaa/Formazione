import { Injectable, signal } from '@angular/core';
import { Product } from '../models';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class RecentlyViewedService {
  private ids = signal<string[]>([]);

  constructor(private storage: StorageService) {
    const saved = this.storage.get<string[]>('recentlyViewed');
    this.ids.set(saved ?? []);
  }

  addToRecentlyViewed(productId: string): void {
    const current = this.ids().filter((id) => id !== productId);
    const updated = [productId, ...current].slice(0, 10);

    this.ids.set(updated);
    this.storage.set('recentlyViewed', updated);
  }

  getRecentlyViewed(allProducts: Product[]): Product[] {
    return this.ids()
      .map((id) => allProducts.find((p) => p.id === id))
      .filter((p): p is Product => !!p);
  }

  clear(): void {
    this.ids.set([]);
    this.storage.remove('recentlyViewed');
  }
}
