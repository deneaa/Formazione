import { inject, Injectable, signal } from '@angular/core';
import { Product } from '../models';
import { StorageService } from './storage.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecentlyViewedService {
  private storage = inject(StorageService);
  private idsSubject: BehaviorSubject<string[]>;

  ids$: Observable<string[]>;

  constructor() {
    const saved = this.storage.get<string[]>('recentlyViewed') ?? [];
    this.idsSubject = new BehaviorSubject<string[]>(saved);
    this.ids$ = this.idsSubject.asObservable();
  }

  addToRecentlyViewed(productId: string): void {
    const current = this.idsSubject.value.filter((id) => id !== productId);
    const updated = [productId, ...current].slice(0, 6);

    this.idsSubject.next(updated);
    this.storage.set('recentlyViewed', updated);
  }

  clear(): void {
    this.idsSubject.next([]);
    this.storage.remove('recentlyViewed');
  }
}
