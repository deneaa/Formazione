import { Injectable, signal } from '@angular/core';
import { Comment, CommentPayload } from '../models';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  comments = signal<Comment[]>([]);

  constructor(private storage: StorageService) {
    const saved = this.storage.get<Comment[]>('comments');
    this.comments.set(saved ?? []);
  }

  getByProduct(productId: string): Comment[] {
    return this.comments()
      .filter((c) => c.productId === productId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  addComment(payload: CommentPayload, userId: string): void {
    const newComment: Comment = {
      id: crypto.randomUUID(),
      productId: payload.productId,
      userId,
      text: payload.text,
      createdAt: new Date().toISOString(),
    };

    const updated = [...this.comments(), newComment];
    this.saveAll(updated);
  }

  deleteComment(id: string): void {
    const updated = this.comments().filter((c) => c.id !== id);
    this.saveAll(updated);
  }

  private saveAll(comments: Comment[]): void {
    this.comments.set(comments);
    this.storage.set('comments', comments);
  }
}
