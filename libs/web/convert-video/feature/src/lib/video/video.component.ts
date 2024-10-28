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
  selectVideoRemoteControlState,
} from '@ever-co/convert-video-data-access';
import { IVideo } from '@ever-co/shared-utils';
import { Store } from '@ngrx/store';
import {
  Observable,
  Subject,
  catchError,
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
  private video!: IVideo;

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
      map((state) => {
        this.video = state.video;
        return state.video.pathname;
      }),
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
    this.store
      .select(selectVideoRemoteControlState)
      .pipe(
        filter(() => this.isControlledRemotely && !!this.player),
        tap((remoteState) => {
          const videoDuration = this.video.metadata?.duration || 0;
          const scrollDuration =
            (videoDuration * remoteState.scrollPercentage) / 100;
          this.player.currentTime = scrollDuration;
        }),
        catchError((err) => {
          console.error('Error in remote control observable', err);
          return [];
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private reload(): void {
    if (this.player) {
      this.player.load();
    } else {
      console.warn('videoPlayer is not ready yet...');
    }
  }

  private get player(): HTMLVideoElement {
    return this.videoPlayer?.nativeElement;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
