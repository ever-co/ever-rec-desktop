import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject
} from '@angular/core';
import { Store } from '@ngrx/store';
import { selectGenerateVideoState } from '@prototype/web/convert-video/data-access';
import { Observable, distinctUntilChanged, map, tap } from 'rxjs';

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
  @ViewChild('videoPlayer', { static: false })
  public videoPlayer!: ElementRef<HTMLVideoElement>;

  ngOnInit(): void {
    this.source$ = this.store.select(selectGenerateVideoState).pipe(
      map((state) => state.videoPathname),
      distinctUntilChanged(),
      tap(() => this.reload())
    );
  }

  public reload() {
    if (this.videoPlayer) {
      this.videoPlayer.nativeElement.load();
    } else {
      console.log('videoPlayer is not ready yet...');
    }
  }
}
