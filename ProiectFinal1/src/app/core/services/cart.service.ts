import { Injectable } from '@angular/core';
import { Product, Purchase } from '../models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private auth: AuthService) {}

  addToCart(productId: string, quantity = 1): void {
    const user = this.auth.currentUser();
    if (!user) return;

    const existing = user.cart.find((i) => i.productId === productId);
    const cart = existing
      ? user.cart.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i,
        )
      : [...user.cart, { productId, quantity }];

    this.auth.updateCurrentUser({ ...user, cart });
  }

  removeFromCart(productId: string): void {
    const user = this.auth.currentUser();
    if (!user) return;

    const cart = user.cart.filter((i) => i.productId !== productId);
    this.auth.updateCurrentUser({ ...user, cart });
  }

  updateQuantity(productId: string, quantity: number): void {
    const user = this.auth.currentUser();
    if (!user) return;

    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const cart = user.cart.map((i) => (i.productId === productId ? { ...i, quantity } : i));
    this.auth.updateCurrentUser({ ...user, cart });
  }

  clearCart(): void {
    const user = this.auth.currentUser();
    if (!user) return;

    this.auth.updateCurrentUser({ ...user, cart: [] });
  }

  getCartTotal(products: Product[]): number {
    const user = this.auth.currentUser();
    if (!user) return 0;

    return user.cart.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
  }

  checkout(products: Product[]): void {
    const user = this.auth.currentUser();
    if (!user || user.cart.length === 0) return;

    const purchase: Purchase = {
      id: crypto.randomUUID(),
      items: [...user.cart],
      total: this.getCartTotal(products),
      date: new Date().toISOString(),
    };

    this.auth.updateCurrentUser({
      ...user,
      cart: [],
      purchases: [...user.purchases, purchase],
    });
  }
}
