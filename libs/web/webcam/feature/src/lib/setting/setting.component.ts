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
import { Resolution } from '@ever-co/shared-utils';
import {
  cameraActions,
  selectCameraMicrophones,
  selectCameraPersistance,
  selectCameras,
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
  public readonly resolutions = Object.values(Resolution);

  constructor(
    private readonly store: Store,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      deviceId: new FormControl(null, [Validators.required]),
      resolution: new FormControl(Resolution.MEDIUM, [Validators.required]),
      canUseCamera: new FormControl(false),
      canUseMicrophone: new FormControl(false),
      checkCamera: new FormControl(false),
      microphoneId: new FormControl(null),
    });

    this.store
      .select(selectCameraPersistance)
      .pipe(
        distinctUntilChanged(),
        tap((state) => this.formGroup.patchValue(state)),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.store.dispatch(cameraActions.loadCameras());
  }

  public onSubmit(): void {
    if (this.formGroup.invalid) {
      return;
    }
    this.store.dispatch(cameraActions.selectCamera(this.formGroup.value));
    this.notificationService.show('Camera settings updated.', 'info');
  }

  public get cameras$(): Observable<MediaDeviceInfo[]> {
    return this.store.select(selectCameras).pipe(takeUntil(this.destroy$));
  }

  public get microphones$(): Observable<MediaDeviceInfo[]> {
    return this.store
      .select(selectCameraMicrophones)
      .pipe(takeUntil(this.destroy$));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
