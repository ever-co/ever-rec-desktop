import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectGenerateVideoState } from '@prototype/web/convert-video/data-access';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'lib-video',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video.component.html',
  styleUrl: './video.component.scss',
})
export class VideoComponent implements OnInit {
  private store = inject(Store);
  public source$!: Observable<string>;
  ngOnInit(): void {
    this.source$ = this.store
      .select(selectGenerateVideoState)
      .pipe(map((state) => state.videoPathname));

      this.store
      .select(selectGenerateVideoState)
      .pipe(map((state) => console.log(state.videoPathname))).subscribe();
  }
}
