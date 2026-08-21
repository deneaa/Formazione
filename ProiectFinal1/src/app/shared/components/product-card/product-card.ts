import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../../../core/models';
import { StarRating } from '../star-rating/star-rating';
import { AuthService } from '../../../core/services/auth.service';
import { TruncatePipe } from '../../pipes/truncate.pipe';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, StarRating, TruncatePipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCard {
  private auth = inject(AuthService);
  private router = inject(Router);
  product = input.required<Product>();
  addToCart = output<string>();

  onAddToCart(event: Event): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
    event.preventDefault();
    event.stopPropagation();
    this.addToCart.emit(this.product().id);
  }
}
