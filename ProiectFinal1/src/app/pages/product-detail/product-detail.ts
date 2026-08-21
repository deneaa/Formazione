// pages/product-detail/product-detail.ts
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CommentService } from '../../core/services/comment.service';
import { CartService } from '../../core/services/cart.service';
import { RecentlyViewedService } from '../../core/services/recently-viewed.service';
import { AuthService } from '../../core/services/auth.service';
import { StarRating } from '../../shared/components/star-rating/star-rating';
import { CommentCard } from '../../shared/components/comment-card/comment-card';

@Component({
  selector: 'app-product-detail',
  imports: [ReactiveFormsModule, StarRating, CommentCard],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  productService = inject(ProductService);
  commentService = inject(CommentService);
  cartService = inject(CartService);
  recentlyViewed = inject(RecentlyViewedService);
  auth = inject(AuthService);

  productId = signal('');

  product = computed(() => this.productService.getById(this.productId()));
  comments = computed(() => this.commentService.getByProduct(this.productId()));

  userRating = computed(() => {
    const p = this.product();
    const user = this.auth.currentUser();
    if (!p || !user) return null;
    return this.productService.getUserRating(p, user.id);
  });

  commentForm = this.fb.nonNullable.group({
    text: ['', [Validators.required, Validators.minLength(2)]],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/products']);
      return;
    }

    this.productId.set(id);
    this.recentlyViewed.addToRecentlyViewed(id);
  }

  rate(value: number): void {
    const user = this.auth.currentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    this.productService.rateProduct(this.productId(), user.id, value);
  }

  submitComment(): void {
    const user = this.auth.currentUser();
    if (!user || this.commentForm.invalid) return;

    this.commentService.addComment(
      { productId: this.productId(), text: this.commentForm.getRawValue().text },
      user.id,
    );
    this.commentForm.reset();
  }

  onDeleteComment(commentId: string): void {
    this.commentService.deleteComment(commentId);
  }

  addToCart(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
    this.cartService.addToCart(this.productId());
  }
}
