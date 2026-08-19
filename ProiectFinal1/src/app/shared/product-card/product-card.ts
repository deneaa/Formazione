import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../core/models';
import { StarRating } from '../star-rating/star-rating';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, StarRating],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  product = input.required<Product>();
  addToCart = output<string>();

  onAddToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.addToCart.emit(this.product().id);
  }
}