import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CATEGORIES } from '../../core/models';

@Component({
  selector: 'app-admin',
  imports: [ReactiveFormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  productService = inject(ProductService);
  private fb = inject(FormBuilder);

  categories = CATEGORIES;

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0.01)]],
    category: [CATEGORIES[0], Validators.required],
    imageUrl: [''],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.productService.addProduct({
      name: value.name,
      description: value.description,
      price: value.price,
      category: value.category,
      imageUrl: value.imageUrl || undefined,
    });

    this.form.reset({ name: '', description: '', price: 0, category: CATEGORIES[0], imageUrl: '' });
  }

  deleteProduct(id: string): void {
    this.productService.deleteProduct(id);
  }
}
