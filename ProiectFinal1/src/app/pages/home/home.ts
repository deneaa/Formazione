import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { RecentlyViewedService } from '../../core/services/recently-viewed.service';
import { CartService } from '../../core/services/cart.service';
import { ProductCard } from '../../shared/product-card/product-card';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ProductCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private productService = inject(ProductService);
  private recentlyViewedService = inject(RecentlyViewedService);
  private cartService = inject(CartService);

  recentlyViewed = computed(() =>
    this.recentlyViewedService.getRecentlyViewed(this.productService.getAll()),
  );

  onAddToCart(productId: string): void {
    this.cartService.addToCart(productId);
  }
}
