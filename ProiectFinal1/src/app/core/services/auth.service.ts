import { Injectable, signal } from '@angular/core';
import { User, RegisterPayload, LoginPayload } from '../models';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser = signal<User | null>(null);

  constructor(private storage: StorageService) {
    this.ensureAdminUser();

    const saved = this.storage.get<User>('currentUser');
    if (saved) {
      this.currentUser.set(saved);
    }
  }

  register(payload: RegisterPayload): { success: boolean; message?: string } {
    const users = this.storage.get<User[]>('users') ?? [];

    const exists = users.some((u) => u.username === payload.username || u.email === payload.email);
    if (exists) {
      return { success: false, message: 'Username sau email deja folosit.' };
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email: payload.email,
      username: payload.username,
      password: payload.password,
      role: 'User',
      cart: [],
      purchases: [],
    };

    users.push(newUser);
    this.storage.set('users', users);

    this.setCurrentUser(newUser);
    return { success: true };
  }

  login(payload: LoginPayload): { success: boolean; message?: string } {
    const users = this.storage.get<User[]>('users') ?? [];

    const found = users.find(
      (u) => u.username === payload.username && u.password === payload.password,
    );

    if (!found) {
      return { success: false, message: 'Username sau parolă greșită.' };
    }

    this.setCurrentUser(found);
    return { success: true };
  }

  logout(): void {
    this.storage.remove('currentUser');
    this.currentUser.set(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUser();
  }

  hasRole(role: User['role']): boolean {
    return this.currentUser()?.role === role;
  }

  setRole(userId: string, role: User['role']): { success: boolean; message?: string } {
    const users = this.storage.get<User[]>('users') ?? [];
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return { success: false, message: 'Userul nu a fost găsit.' };
    }

    user.role = role;
    this.storage.set('users', users);

    if (this.currentUser()?.id === userId) {
      this.setCurrentUser(user);
    }

    return { success: true };
  }

  updateCurrentUser(updated: User): void {
    const users = this.storage.get<User[]>('users') ?? [];
    const index = users.findIndex((u) => u.id === updated.id);
    if (index !== -1) {
      users[index] = updated;
      this.storage.set('users', users);
    }
    this.setCurrentUser(updated);
  }

  private setCurrentUser(user: User): void {
    this.storage.set('currentUser', user);
    this.currentUser.set(user);
  }

  private ensureAdminUser(): void {
    const users = this.storage.get<User[]>('users') ?? [];

    const adminExists = users.some((user) => user.username === 'Admin');

    if (adminExists) {
      return;
    }

    const admin: User = {
      id: crypto.randomUUID(),
      username: 'Admin',
      email: 'admin@store.com',
      password: '123456',
      role: 'Admin',
      cart: [],
      purchases: [],
    };

    users.push(admin);
    this.storage.set('users', users);
  }
}
