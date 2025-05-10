import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import {
  selectGenerateVideoConfig,
  generateVideoSettingActions,
} from '@ever-co/generate-video-data-access';
import { NotificationService } from '@ever-co/notification-data-access';
import {
  CodecPipe,
  HumanizePipe,
  ResolutionPipe,
} from '@ever-co/shared-service';
import { FfmpegVideoCodec, resolutionMapper } from '@ever-co/shared-utils';
import { Store } from '@ngrx/store';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'lib-convert-video-setting',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    HumanizePipe,
    MatSelectModule,
    ResolutionPipe,
    CodecPipe,
  ],
  templateUrl: './generate-video-setting.component.html',
  styleUrl: './generate-video-setting.component.scss',
})
export class GenerateVideoSettingComponent implements OnInit, OnDestroy {
  public formGroup!: FormGroup;
  private store = inject(Store);
  private destroy$ = new Subject<void>();
  public periods = [5, 10, 15, 30];
  public resolutions = Object.keys(resolutionMapper);
  public codecList = Object.values(FfmpegVideoCodec);

  constructor(private readonly notificationService: NotificationService) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      frameRate: new FormControl('', Validators.required),
      codec: new FormControl(FfmpegVideoCodec.H264, Validators.required),
      resolution: new FormControl('1920:1080', Validators.required),
      batch: new FormControl('', [Validators.required]),
      period: new FormControl('10', [Validators.required]),
      optimized: new FormControl(false),
      autoGenerate: new FormControl(true),
    });

    this.store
      .select(selectGenerateVideoConfig)
      .pipe(
        tap((config) => {
          this.formGroup.patchValue(config);
          this.onCheck({ checked: config.autoGenerate });
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.store.dispatch(generateVideoSettingActions.load());
  }

  public onCheck({ checked }: Partial<MatSlideToggleChange>) {
    if (checked) {
      this.formGroup.controls['period'].enable();
    } else {
      this.formGroup.controls['period'].disable();
    }
  }

  public get optimizedControl(): boolean {
    return this.formGroup.get('optimized')?.value;
  }

  public onSubmit(): void {
    this.store.dispatch(
      generateVideoSettingActions.update({ videoConfig: this.formGroup.value }),
    );
    this.notificationService.show('Generate video settings updated.', 'info');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
