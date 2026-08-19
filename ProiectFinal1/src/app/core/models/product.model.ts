import { Rating } from './rating.model';
import { Category } from './category.model';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  createdAt: string;
  imageUrl?: string;
  ratings: Rating[];
  averageRating: number;
}

export interface ProductPayload {
  name: string;
  description: string;
  price: number;
  category: Category;
  imageUrl?: string;
}
