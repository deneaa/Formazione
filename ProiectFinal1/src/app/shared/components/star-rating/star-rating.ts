import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucideStar } from '@lucide/angular';

@Component({
  selector: 'app-star-rating',
  imports: [LucideStar],
  templateUrl: './star-rating.html',
  styleUrl: './star-rating.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarRating {
  value = input<number>(0);
  interactive = input<boolean>(false);
  rated = output<number>();
  stars = [1, 2, 3, 4, 5];

  onClick(star: number): void {
    if (this.interactive()) {
      this.rated.emit(star);
    }
  }

  fillPercent(star: number): number {
    const diff = this.value() - (star - 1);
    if (diff >= 1) return 100;
    if (diff >= 0.5) return 50;
    return 0;
  }
}
