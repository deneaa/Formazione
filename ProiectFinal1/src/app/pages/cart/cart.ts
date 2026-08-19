// pages/cart/cart.ts
import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { Product } from '../../core/models';

interface CartLine {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  private router = inject(Router);
  productService = inject(ProductService);
  cartService = inject(CartService);
  auth = inject(AuthService);

  cartItems = computed<CartLine[]>(() => {
    const user = this.auth.currentUser();
    if (!user) return [];

    const lines: CartLine[] = [];

    for (const item of user.cart) {
      const product = this.productService.getById(item.productId);
      if (product) {
        lines.push({ product, quantity: item.quantity });
      }
    }

    return lines;
  });

  total = computed(() => this.cartService.getCartTotal(this.productService.getAll()));

  updateQuantity(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  remove(productId: string): void {
    this.cartService.removeFromCart(productId);
  }

  checkout(): void {
    this.cartService.checkout(this.productService.getAll());
    this.router.navigate(['/profile']);
  }
}
