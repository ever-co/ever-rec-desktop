/* eslint-disable @angular-eslint/no-input-rename */
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectGenerateVideoState,
  selectSettingState,
  selectVideoRemoteControlState,
} from '@prototype/web/convert-video/data-access';
import { selectScreenshotState } from '@prototype/web/screenshot/data-access';
import {
  Observable,
  Subject,
  combineLatestWith,
  distinctUntilChanged,
  filter,
  map,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'lib-video',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video.component.html',
  styleUrl: './video.component.scss',
})
export class VideoComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  public source$!: Observable<string>;
  @ViewChild('videoPlayer', { static: false })
  public videoPlayer!: ElementRef<HTMLVideoElement>;
  private destroy$ = new Subject<void>();
  @Input({
    required: true,
    alias: 'remote',
    transform: (value: string) => value === 'true',
  })
  public isControledRemotetly = false;

  ngOnInit(): void {
    this.source$ = this.store.select(selectGenerateVideoState).pipe(
      map((state) => state.videoPathname),
      distinctUntilChanged(),
      filter(() => !!this.videoPlayer),
      tap(() => this.reload()),
      takeUntil(this.destroy$)
    );
    this.store
      .select(selectVideoRemoteControlState)
      .pipe(
        filter(() => this.isControledRemotetly),
        combineLatestWith(
          this.store.select(selectSettingState),
          this.store.select(selectScreenshotState)
        ),
        tap(([{ scrollPercentage }, { videoConfig }, { screenshots }]) => {
          const frameRate = videoConfig.frameRate;
          const frameCount = screenshots.length;
          const videoDuration = frameCount / frameRate;
          const scrollDuration = (videoDuration * scrollPercentage) / 100;
          console.log(scrollDuration);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private reload() {
    if (this.videoPlayer) {
      this.videoPlayer.nativeElement.load();
    } else {
      console.log('videoPlayer is not ready yet...');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
