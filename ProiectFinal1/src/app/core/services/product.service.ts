import { Injectable, signal } from '@angular/core';
import { Product, ProductPayload, Rating, Category } from '../models';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  products = signal<Product[]>([]);

  constructor(private storage: StorageService) {
    const saved = this.storage.get<Product[]>('products');
    if (saved && saved.length) {
      this.products.set(saved);
    } else {
      this.products.set(this.getSeedData());
      this.storage.set('products', this.getSeedData());
    }
  }

  getAll(): Product[] {
    return this.products();
  }

  getById(id: string): Product | undefined {
    return this.products().find((p) => p.id === id);
  }

  addProduct(payload: ProductPayload): void {
    const newProduct: Product = {
      id: crypto.randomUUID(),
      name: payload.name,
      description: payload.description,
      price: payload.price,
      category: payload.category,
      imageUrl: payload.imageUrl,
      createdAt: new Date().toISOString(),
      ratings: [],
      averageRating: 0,
    };

    const updated = [...this.products(), newProduct];
    this.saveAll(updated);
  }

  updateProduct(id: string, payload: ProductPayload): void {
    const updated = this.products().map((p) => (p.id === id ? { ...p, ...payload } : p));
    this.saveAll(updated);
  }

  deleteProduct(id: string): void {
    const updated = this.products().filter((p) => p.id !== id);
    this.saveAll(updated);
  }

  rateProduct(productId: string, userId: string, value: number): void {
    const updated = this.products().map((p) => {
      if (p.id !== productId) return p;

      const existing = p.ratings.find((r) => r.userId === userId);
      let ratings: Rating[];

      if (existing) {
        ratings = p.ratings.map((r) =>
          r.userId === userId ? { ...r, value, createdAt: new Date().toISOString() } : r,
        );
      } else {
        const newRating: Rating = {
          id: crypto.randomUUID(),
          userId,
          value,
          createdAt: new Date().toISOString(),
        };
        ratings = [...p.ratings, newRating];
      }

      return {
        ...p,
        ratings,
        averageRating: this.calculateAverage(ratings),
      };
    });

    this.saveAll(updated);
  }

  getUserRating(product: Product, userId: string): number | null {
    return product.ratings.find((r) => r.userId === userId)?.value ?? null;
  }

  searchProducts(query: string): Product[] {
    const q = query.trim().toLowerCase();
    if (!q) return this.products();
    return this.products().filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
    );
  }

  filterByCategory(category: Category | null): Product[] {
    if (!category) return this.products();
    return this.products().filter((p) => p.category === category);
  }

  sortProducts(products: Product[], sortBy: 'date' | 'rating' | 'category'): Product[] {
    const copy = [...products];
    switch (sortBy) {
      case 'date':
        return copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      case 'rating':
        return copy.sort((a, b) => b.averageRating - a.averageRating);
      case 'category':
        return copy.sort((a, b) => a.category.localeCompare(b.category));
      default:
        return copy;
    }
  }

  private calculateAverage(ratings: Rating[]): number {
    if (!ratings.length) return 0;
    const sum = ratings.reduce((acc, r) => acc + r.value, 0);
    return Math.round((sum / ratings.length) * 10) / 10;
  }

  private saveAll(products: Product[]): void {
    this.products.set(products);
    this.storage.set('products', products);
  }

  private getSeedData(): Product[] {
    return [
      {
        id: crypto.randomUUID(),
        name: 'Wireless Headphones',
        description: 'Noise-cancelling over-ear headphones with 30h battery life.',
        price: 199.99,
        category: 'Electronics',
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        ratings: [],
        averageRating: 0,
      },
      {
        id: crypto.randomUUID(),
        name: 'Running Shoes',
        description: 'Lightweight breathable shoes, perfect for daily runs.',
        price: 89.99,
        category: 'Sports & Outdoors',
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        ratings: [],
        averageRating: 0,
      },
      {
        id: crypto.randomUUID(),
        name: 'Denim Jacket',
        description: 'Classic fit denim jacket, unisex.',
        price: 59.99,
        category: 'Fashion',
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        ratings: [],
        averageRating: 0,
      },
      {
        id: crypto.randomUUID(),
        name: 'Ceramic Plant Pot',
        description: 'Minimalist ceramic pot, ideal for small indoor plants.',
        price: 24.99,
        category: 'Home & Garden',
        createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
        ratings: [],
        averageRating: 0,
      },
      {
        id: crypto.randomUUID(),
        name: 'Sci-Fi Novel Collection',
        description: 'A boxed set of 3 classic science fiction novels.',
        price: 34.99,
        category: 'Books & Media',
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        ratings: [],
        averageRating: 0,
      },
    ];
  }
}
