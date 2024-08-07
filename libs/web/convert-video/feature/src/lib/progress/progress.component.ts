import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { selectGenerateVideoState } from '@ever-capture/web/convert-video/data-access';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'lib-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss',
})
export class ProgressComponent implements OnInit {
  private store = inject(Store);
  public progress$!: Observable<number>;
  public generating$!: Observable<boolean>;

  ngOnInit(): void {
    this.generating$ = this.store
      .select(selectGenerateVideoState)
      .pipe(map((state) => state.generating));
    this.progress$ = this.store
      .select(selectGenerateVideoState)
      .pipe(map((state) => state.progress));
  }
}
