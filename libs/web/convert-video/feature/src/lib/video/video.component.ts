/* eslint-disable @angular-eslint/no-input-rename */
import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import {
  generateVideoActions,
  selectGenerateVideoState,
  selectSettingState,
  selectVideoRemoteControlState,
} from '@ever-capture/convert-video-data-access';
import { selectScreenshotState } from '@ever-capture/screenshot-data-access';
import { Store } from '@ngrx/store';
import {
  Observable,
  Subject,
  catchError,
  combineLatest,
  filter,
  map,
  of,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'lib-video',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'], // Fixed typo
})
export class VideoComponent
  implements OnInit, AfterViewInit, AfterContentInit, OnDestroy
{
  private store = inject(Store);
  private destroy$ = new Subject<void>();

  @ViewChild('videoPlayer', { static: false })
  public videoPlayer!: ElementRef<HTMLVideoElement>;

  @Input({
    alias: 'remote',
    transform: (value: string) => value === 'true',
  })
  public isControlledRemotely = false;

  public source$!: Observable<string>;
  public generating$!: Observable<boolean>;

  ngOnInit(): void {
    this.setupSourceObservable();
    this.setupGeneratingObservable();
    this.setupRemoteControlObservable();
  }

  ngAfterViewInit(): void {
    this.store
      .select(selectGenerateVideoState)
      .pipe(
        filter(() => !!this.videoPlayer),
        tap(() => this.reload()),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngAfterContentInit(): void {
    this.store.dispatch(generateVideoActions.loadLastVideo());
  }

  private setupSourceObservable(): void {
    this.source$ = this.store.select(selectGenerateVideoState).pipe(
      map((state) => state.video.pathname),
      catchError((err) => {
        console.error('Error in source observable', err);
        return '';
      }),
      takeUntil(this.destroy$)
    );
  }

  private setupGeneratingObservable(): void {
    this.generating$ = this.store.select(selectGenerateVideoState).pipe(
      map(({ generating }) => generating),
      catchError((err) => {
        console.error('Error in generating observable', err);
        return of(false);
      }),
      takeUntil(this.destroy$)
    );
  }

  private setupRemoteControlObservable(): void {
    combineLatest([
      this.store.select(selectVideoRemoteControlState),
      this.store.select(selectSettingState),
      this.store.select(selectScreenshotState),
    ])
      .pipe(
        filter(() => this.isControlledRemotely && !!this.videoPlayer),
        tap(([remoteState, settingState, screenshotState]) => {
          this.handleRemoteControlState(
            remoteState,
            settingState,
            screenshotState
          );
        }),
        catchError((err) => {
          console.error('Error in remote control observable', err);
          return [];
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private handleRemoteControlState(
    remoteState: any,
    settingState: any,
    screenshotState: any
  ): void {
    const frameRate = settingState.videoConfig.frameRate;
    const frameCount = screenshotState.count;
    const videoDuration = frameCount / frameRate;
    const scrollDuration = (videoDuration * remoteState.scrollPercentage) / 100;
    this.videoPlayer.nativeElement.currentTime = scrollDuration;
  }

  private reload(): void {
    if (this.videoPlayer) {
      this.videoPlayer.nativeElement.load();
    } else {
      console.warn('videoPlayer is not ready yet...');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
