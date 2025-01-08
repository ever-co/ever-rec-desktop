import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { videoActions } from '@ever-co/convert-video-data-access';
import {
  HumanizePipe,
  PopoverDirective,
  ResolutionPipe,
  UtcToLocalTimePipe,
} from '@ever-co/shared-service';
import { IActionButton, ISelected, IVideo } from '@ever-co/shared-utils';
import { selectUploadState, uploadActions } from '@ever-co/upload-data-access';
import { selectSettingStorageState } from '@ever-co/web-setting-data-access';
import { Store } from '@ngrx/store';
import {
  BehaviorSubject,
  filter,
  fromEvent,
  map,
  Observable,
  Subject,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { ActionButtonGroupComponent } from '../action-button-group/group/action-button-group.component';
import { ConfirmationDialogService } from '../dialogs/services/confirmation-dialog.service';

@Component({
  selector: 'lib-video',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    UtcToLocalTimePipe,
    PopoverDirective,
    ActionButtonGroupComponent,
    MatRippleModule,
    MatTooltipModule,
    MatCheckboxModule,
    ResolutionPipe,
    HumanizePipe,
  ],
  templateUrl: './video.component.html',
  styleUrl: './video.component.scss',
})
export class VideoComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoPlayer', { static: false })
  public videoPlayer!: ElementRef<HTMLVideoElement>;

  @Input()
  public controls = false;

  @Input()
  public video!: IVideo;

  @Input()
  public checked: boolean | null = false;

  @Output()
  public selected = new EventEmitter<ISelected<IVideo>>();

  public played$ = new BehaviorSubject<boolean>(false);

  private destroy$ = new Subject<void>();

  public actionButtons: IActionButton[] = [
    {
      icon: 'visibility',
      label: 'View',
      variant: 'default',
      action: this.view.bind(this),
    },
    {
      icon: 'backup',
      label: 'Upload',
      variant: 'success',
      action: this.upload.bind(this),
      loading: this.uploading$,
      disable: this.uploading$,
      hide: this.isUploadHidden$,
    },
    {
      icon: 'delete',
      label: 'Delete',
      variant: 'danger',
      action: this.delete.bind(this),
    },
  ];

  constructor(
    private readonly router: Router,
    private readonly store: Store,
    private readonly confirmationDialogService: ConfirmationDialogService
  ) {}

  ngAfterViewInit(): void {
    fromEvent(this.player, 'play')
      .pipe(
        tap(() => this.played$.next(true)),
        takeUntil(this.destroy$)
      )
      .subscribe();

    fromEvent(this.player, 'pause')
      .pipe(
        tap(() => this.played$.next(false)),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  public async togglePlayPause(): Promise<void> {
    if (!this.player) {
      console.error('Video player is not available');
      return;
    }

    if (this.isPaused) {
      await this.player.play();
    } else {
      this.player.pause();
    }
  }

  public async fullscreen(): Promise<void> {
    if (!this.player) {
      console.error('Video player is not available');
      return;
    }

    await this.player.requestFullscreen();
  }

  public get player(): HTMLVideoElement {
    return this.videoPlayer?.nativeElement;
  }

  public get isPaused(): boolean {
    return this.player?.paused;
  }

  public async view(video: IVideo): Promise<void> {
    await this.router.navigate(['/', 'library', 'videos', video.id]);
  }

  public delete(video: IVideo): void {
    this.confirmationDialogService
      .open({
        title: 'Delete Video',
        message: `Are you sure you want to delete this video?`,
        variant: 'danger',
      })
      .pipe(
        take(1),
        filter(Boolean),
        tap(() => this.store.dispatch(videoActions.deleteVideo(video))),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private upload(video: IVideo): void {
    this.confirmationDialogService
      .open({
        title: 'Upload Video',
        message: `Are you sure you want to upload this video?`,
        variant: 'primary',
        button: {
          confirm: {
            label: 'Upload',
            variant: 'success',
            icon: 'backup',
          },
        },
      })
      .pipe(
        take(1),
        filter(Boolean),
        tap(() =>
          this.store.dispatch(uploadActions.uploadVideo({ videos: [video] }))
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private get isUploadHidden$(): Observable<boolean> {
    return this.store.select(selectSettingStorageState).pipe(
      map(({ uploadConfig }) => !uploadConfig.manualSync),
      takeUntil(this.destroy$)
    );
  }

  private get uploading$(): Observable<boolean> {
    return this.store.select(selectUploadState).pipe(
      map(({ uploading }) => uploading),
      takeUntil(this.destroy$)
    );
  }

  public onSelected(checked: boolean): void {
    this.checked = checked;
    this.selected.emit({
      data: this.video,
      selected: checked,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
