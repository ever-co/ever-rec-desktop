import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterOutlet } from '@angular/router';
import { NotificationService } from '@ever-co/notification-data-access';
import {
  selectCameraPersistance,
  selectCameras,
  WebcamActions,
} from '@ever-co/webcam-data-access';
import { Store } from '@ngrx/store';
import {
  distinctUntilChanged,
  Observable,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'lib-setting',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
    RouterOutlet,
  ],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingComponent implements OnInit, OnDestroy {
  public formGroup!: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(
    private readonly store: Store,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      webcam: new FormControl(null, [Validators.required]),
      tracking: new FormControl(false),
      checkCamera: new FormControl(false),
    });

    this.store
      .select(selectCameraPersistance)
      .pipe(
        distinctUntilChanged(),
        tap((state) =>
          this.formGroup.patchValue({
            webcam: state.selectedWebcam?.deviceId,
            tracking: state.tracking,
          })
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.store.dispatch(WebcamActions.loadWebcams());
  }

  public onSubmit(): void {
    if (this.formGroup.invalid) {
      return;
    }
    this.store.dispatch(
      WebcamActions.selectWebcam({
        deviceId: this.formGroup.value.webcam,
        tracking: this.formGroup.value.tracking,
      })
    );
    this.notificationService.show('Camera settings updated.', 'info');
  }

  public get cameras$(): Observable<MediaDeviceInfo[]> {
    return this.store.select(selectCameras).pipe(takeUntil(this.destroy$));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
