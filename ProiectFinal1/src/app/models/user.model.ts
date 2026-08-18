export type Role = 'User' | 'Admin';

export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  role: Role;
  cart: CartItem[];
  purchases: Purchase[];
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Purchase {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
}
