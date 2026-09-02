import { Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { LoginPayload, RegisterPayload, User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser = signal<User | null>(null);
  constructor(private storage: StorageService) {
    const saved = this.storage.get<User>('currentUser');

    if (saved) this.currentUser.set(saved);
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
      tasks: [],
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

  getUsernameById(id: string): string {
    const users = this.storage.get<User[]>('users') ?? [];
    const user = users.find((u) => u.id === id);

    return user?.username ?? 'Unknown';
  }

  isAuthenticated(): boolean {
    return !!this.currentUser();
  }
}
