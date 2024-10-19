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
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import {
  selectSettingState,
  settingActions,
} from '@ever-co/convert-video-data-access';
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
    MatFormFieldModule
  ],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss',
})
export class SettingComponent implements OnInit, OnDestroy {
  public formGroup!: FormGroup;
  private store = inject(Store);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      frameRate: new FormControl('', Validators.required),
      codec: new FormControl('', Validators.required),
      resolution: new FormControl('', Validators.required),
      batch: new FormControl('', [Validators.required]),
      optimized: new FormControl(false),
    });

    this.store
      .select(selectSettingState)
      .pipe(
        tap((state) => this.formGroup.patchValue(state.videoConfig)),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.store.dispatch(settingActions.load());
  }

  public onCheck({ checked }: MatSlideToggleChange) {
    this.formGroup.controls['optimized'].setValue(checked);
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
