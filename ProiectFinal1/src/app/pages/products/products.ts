// pages/products/products.ts
import { Component, computed, inject, signal } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { ExportService } from '../../core/services/export.service';
import { CATEGORIES, Category } from '../../core/models';
import { ProductList } from '../../shared/components/product-list/product-list';
import { SearchBar } from '../../shared/components/search-bar/search-bar';

type SortOption = 'date' | 'rating' | 'category';

@Component({
  selector: 'app-products',
  imports: [ProductList, SearchBar],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private exportService = inject(ExportService);

  categories = CATEGORIES;
  query = signal('');
  selectedCategory = signal<Category | null>(null);
  sortBy = signal<SortOption>('date');

  filteredProducts = computed(() => {
    let result = this.productService.products();

    const q = this.query().trim().toLowerCase();
    if (q) {
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
      );
    }

    const category = this.selectedCategory();
    if (category) {
      result = result.filter((p) => p.category === category);
    }

    return this.productService.sortProducts(result, this.sortBy());
  });

  onSearch(value: string): void {
    this.query.set(value);
  }

  onCategoryChange(value: string): void {
    this.selectedCategory.set(value ? (value as Category) : null);
  }

  onSortChange(value: string): void {
    this.sortBy.set(value as SortOption);
  }

  onAddToCart(productId: string): void {
    this.cartService.addToCart(productId);
  }

  exportPdf(): void {
    this.exportService.exportProductsToPdf(this.filteredProducts());
  }

  fetchRandom(): void {
    this.productService.fetchRandomProduct();
  }
}
