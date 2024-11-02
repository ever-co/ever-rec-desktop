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
  selectSettingState,
  settingActions,
} from '@ever-co/convert-video-data-access';
import { HumanizePipe, ResolutionPipe } from '@ever-co/shared-service';
import { resolutionMapper } from '@ever-co/shared-utils';
import { Store } from '@ngrx/store';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'lib-convert-video-setting',
  standalone: true,
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
    ResolutionPipe
  ],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss',
})
export class SettingComponent implements OnInit, OnDestroy {
  public formGroup!: FormGroup;
  private store = inject(Store);
  private destroy$ = new Subject<void>();
  public periods = [5, 10, 15, 30];
  public resolutions = Object.keys(resolutionMapper);

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      frameRate: new FormControl('', Validators.required),
      codec: new FormControl('', Validators.required),
      resolution: new FormControl('1920:1080', Validators.required),
      batch: new FormControl('', [Validators.required]),
      period: new FormControl('10', [Validators.required]),
      optimized: new FormControl(false),
      autoGenerate: new FormControl(true),
    });

    this.store
      .select(selectSettingState)
      .pipe(
        tap(({ videoConfig }) => {
          this.formGroup.patchValue(videoConfig);
          this.onCheck({ checked: videoConfig.autoGenerate });
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.store.dispatch(settingActions.load());
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
      settingActions.update({ videoConfig: this.formGroup.value })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
