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

  pageSize = 8;
  currentPage = signal(1);

  allFilteredProducts = computed(() => {
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

  totalPages = computed(() => Math.max(1, Math.ceil(this.allFilteredProducts().length / this.pageSize)));

  filteredProducts = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.allFilteredProducts().slice(start, start + this.pageSize);
  });

  pages = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  onSearch(value: string): void {
    this.query.set(value);
    this.currentPage.set(1);
  }

  onCategoryChange(value: string): void {
    this.selectedCategory.set(value ? (value as Category) : null);
    this.currentPage.set(1);
  }

  onSortChange(value: string): void {
    this.sortBy.set(value as SortOption);
    this.currentPage.set(1);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
  }

  prevPage(): void {
    this.goToPage(this.currentPage() - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  onAddToCart(productId: string): void {
    this.cartService.addToCart(productId);
  }

  exportPdf(): void {
    this.exportService.exportProductsToPdf(this.allFilteredProducts());
  }

  fetchRandom(): void {
    this.productService.fetchRandomProduct();
  }
}
