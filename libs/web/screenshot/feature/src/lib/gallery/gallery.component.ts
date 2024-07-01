import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectScreenshotState } from '@prototype/web/screenshot/data-access';
import {
  BehaviorSubject,
  Observable,
  Subject,
  map,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'lib-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent implements OnInit {
  public screenshots$ = new BehaviorSubject<string[]>([]);
  public capturing$!: Observable<boolean>;
  private destroy$ = new Subject<void>();
  public store = inject(Store);

  ngOnInit(): void {
    this.capturing$ = this.store.select(selectScreenshotState).pipe(
      tap((state) => this.add(state.screenshot)),
      map((state) => state.capturing),
      takeUntil(this.destroy$)
    );
  }

  private add(screenshot: string | undefined) {
    if (screenshot) {
      this.screenshots$.next([screenshot, ...this.screenshots$.value]);
    }
  }
}
