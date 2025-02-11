import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import {
  selectVideoState,
  videoActions,
} from '@ever-co/convert-video-data-access';
import {
  ActionButtonGroupComponent,
  ConfirmationDialogService,
  NoDataComponent,
  VideoComponent,
} from '@ever-co/shared-components';
import {
  CopyToClipboardDirective,
  HumanizeBytesPipe,
  HumanizePipe,
  PopoverDirective,
  ResolutionPipe,
  UtcToLocalTimePipe,
} from '@ever-co/shared-service';
import { IActionButton, IVideo, IVideoMetadata } from '@ever-co/shared-utils';
import { selectUploadState, uploadActions } from '@ever-co/upload-data-access';
import { selectSettingStorageState } from '@ever-co/web-setting-data-access';
import { Store } from '@ngrx/store';
import {
  combineLatest,
  concatMap,
  debounceTime,
  distinctUntilChanged,
  filter,
  lastValueFrom,
  map,
  Observable,
  of,
  Subject,
  take,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'lib-video-detail',
  standalone: true,
  imports: [
    CommonModule,
    NoDataComponent,
    VideoComponent,
    MatChipsModule,
    UtcToLocalTimePipe,
    MatCardModule,
    MatDividerModule,
    MatTooltipModule,
    MatIconModule,
    HumanizeBytesPipe,
    MatFormFieldModule,
    MatInputModule,
    PopoverDirective,
    ActionButtonGroupComponent,
    HumanizePipe,
    CopyToClipboardDirective,
    ResolutionPipe,
    FormsModule,
  ],
  templateUrl: './video-detail.component.html',
  styleUrl: './video-detail.component.scss',
})
export class VideoDetailComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public actionButtons: IActionButton[] = [
    {
      icon: 'copy',
      label: 'Duplicate',
      variant: 'default',
    },
    {
      icon: 'summarize',
      label: 'Summarize',
      variant: 'warning',
    },
    {
      label: 'Upload',
      variant: 'success',
      icon: 'backup',
      hide: this.isUploadHidden$,
      action: this.upload.bind(this),
      loading: this.uploading$,
      disable: this.uploading$,
    },
    {
      icon: 'delete',
      label: 'Delete',
      variant: 'danger',
      action: this.deleteVideo.bind(this),
    },
  ];
  public isEditing = false;

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly confirmationDialogService: ConfirmationDialogService,
    private readonly store: Store
  ) {}
  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        filter(Boolean),
        concatMap(async (params) => {
          if (params['id']) {
            this.store.dispatch(
              videoActions.loadVideo({
                where: {
                  id: params['id'],
                },
                relations: ['metadata'],
              })
            );
          } else {
            await this.router.navigate(['/dashboard']);
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  public get video$(): Observable<IVideo> {
    return this.store.select(selectVideoState).pipe(
      map((state) => state.video),
      takeUntil(this.destroy$)
    );
  }

  public async deleteVideo(video: IVideo): Promise<void> {
    const isConfirmed = await lastValueFrom(
      this.confirmationDialogService.open({
        title: 'Delete Video',
        message: 'Are you sure you want to delete this video?',
        variant: 'danger',
      })
    );
    if (isConfirmed) {
      this.store.dispatch(videoActions.deleteVideo(video));
      await this.router.navigate(['/', 'library', 'videos']);
    }
  }

  public onSummaryChange(summary: string, video: IVideo) {
    of(summary)
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap((summary) => {
          const metadata = {
            ...video.metadata,
            summary,
          } as IVideoMetadata;
          this.store.dispatch(
            videoActions.updateVideo({
              ...video,
              metadata,
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  public onTitleChange(title: string, video: IVideo) {
    of(title)
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap((title) => {
          const metadata = {
            ...video.metadata,
            name: title,
          } as IVideoMetadata;
          this.store.dispatch(
            videoActions.updateVideo({
              ...video,
              metadata,
            })
          );
        }),
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
    return combineLatest([
      this.store.select(selectSettingStorageState),
      this.uploading$,
      this.video$,
    ]).pipe(
      map(
        ([{ uploadConfig }, uploading, video]) =>
          !uploadConfig.manualSync || uploading || !!video?.isTimeline
      ),
      takeUntil(this.destroy$)
    );
  }

  public get uploading$(): Observable<boolean> {
    return this.store.select(selectUploadState).pipe(
      map(({ uploading }) => uploading),
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
