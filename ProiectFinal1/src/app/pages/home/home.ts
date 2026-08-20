import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from '../../core/services/product.service';
import { RecentlyViewedService } from '../../core/services/recently-viewed.service';
import { CartService } from '../../core/services/cart.service';
import { ProductCard } from '../../shared/product-card/product-card';
import { Product } from '../../core/models';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ProductCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  private productService = inject(ProductService);
  private recentlyViewedService = inject(RecentlyViewedService);
  private cartService = inject(CartService);

  private subscription?: Subscription;

  recentlyViewed = signal<Product[]>([]);

  ngOnInit(): void {
    this.subscription = this.recentlyViewedService.ids$.subscribe((ids) => {
      this.recentlyViewed.set(this.mapIdsToProducts(ids));
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onAddToCart(productId: string): void {
    this.cartService.addToCart(productId);
  }

  private mapIdsToProducts(ids: string[]): Product[] {
    const products: Product[] = [];

    for (const id of ids) {
      const product = this.productService.getById(id);
      if (product) {
        products.push(product);
      }
    }

    return products;
  }
}
