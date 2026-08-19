import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  imports: [],
  templateUrl: './star-rating.html',
  styleUrl: './star-rating.css',
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
}
