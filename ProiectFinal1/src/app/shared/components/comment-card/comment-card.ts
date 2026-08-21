import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { Comment } from '../../../core/models';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { LucideX } from '@lucide/angular';

@Component({
  selector: 'app-comment-card',
  imports: [DatePipe, LucideX],
  templateUrl: './comment-card.html',
  styleUrl: './comment-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentCard {
  private auth = inject(AuthService);

  comment = input.required<Comment>();
  deleteComment = output<string>();

  username = computed(() => this.auth.getUsernameById(this.comment().userId));

  canDelete = computed(() => {
    const user = this.auth.currentUser();
    const comment = this.comment();

    return user?.id === comment.userId || user?.role === 'Admin';
  });

  onDeleteComment = (id: string) => {
    this.deleteComment.emit(id);
  };
}
