import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { screenshotActions } from '@ever-co/screenshot-data-access';
import {
  IconFallbackDirective,
  ImgFallbackDirective,
  PopoverDirective,
  UtcToLocalTimePipe,
} from '@ever-co/shared-service';
import { IActionButton, IScreenshot, ISelected } from '@ever-co/shared-utils';
import {
  selectUploadInProgress,
  uploadActions,
  UploadScreenshotItem,
} from '@ever-co/upload-data-access';
import { selectSettingStorageState } from '@ever-co/web-setting-data-access';
import { Store } from '@ngrx/store';
import { filter, map, Observable, Subject, take, takeUntil, tap } from 'rxjs';
import { ActionButtonGroupComponent } from '../action-button-group/group/action-button-group.component';
import { ConfirmationDialogService } from '../dialogs/services/confirmation-dialog.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'lib-screenshot',
  imports: [
    CommonModule,
    MatCardModule,
    UtcToLocalTimePipe,
    PopoverDirective,
    MatIconModule,
    MatButtonModule,
    ActionButtonGroupComponent,
    ImgFallbackDirective,
    IconFallbackDirective,
    MatCheckboxModule,
    MatTooltipModule,
  ],
  templateUrl: './screenshot.component.html',
  styleUrl: './screenshot.component.scss',
})
export class ScreenshotComponent implements OnDestroy, OnDestroy {
  @Input() screenshot!: IScreenshot;

  @Input()
  public checked: boolean | null = false;

  @Output()
  public selected = new EventEmitter<ISelected<IScreenshot>>();

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
      loadingLabel: 'Uploading...',
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
    private readonly confirmationDialogService: ConfirmationDialogService,
  ) {}

  public async view(): Promise<void> {
    await this.router.navigate([
      '/',
      'library',
      'screenshots',
      this.screenshot.id,
    ]);
  }

  public onSelected(checked: boolean): void {
    this.checked = checked;
    this.selected.emit({
      data: this.screenshot,
      selected: checked,
    });
  }

  public delete(screenshot: IScreenshot) {
    this.confirmationDialogService
      .open({
        title: 'Delete Screenshot',
        message: `Are you sure you want to delete this screenshot?`,
        variant: 'danger',
      })
      .pipe(
        take(1),
        filter(Boolean),
        tap(() =>
          this.store.dispatch(screenshotActions.deleteScreenshot(screenshot)),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  private upload(screenshot: IScreenshot): void {
    this.confirmationDialogService
      .open({
        title: 'Upload Screenshot',
        message: `Are you sure you want to upload this screenshot?`,
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
          this.store.dispatch(
            uploadActions.addItemToQueue({
              item: new UploadScreenshotItem(screenshot),
            }),
          ),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  private get isUploadHidden$(): Observable<boolean> {
    return this.store.select(selectSettingStorageState).pipe(
      map(({ uploadConfig }) => !uploadConfig.manualSync),
      takeUntil(this.destroy$),
    );
  }

  private get uploading$(): Observable<boolean> {
    return this.store
      .select(selectUploadInProgress)
      .pipe(takeUntil(this.destroy$));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
