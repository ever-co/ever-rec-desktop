import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import {
    generateVideoActions,
    selectGenerateVideoState,
    selectSettingState,
    settingActions,
} from '@ever-co/convert-video-data-access';
import { selectScreenshotState } from '@ever-co/screenshot-data-access';
import { ToggleComponent } from '@ever-co/shared-components';
import { Store } from '@ngrx/store';
import { map, Observable, Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'lib-setting',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToggleComponent],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss',
})
export class SettingComponent implements OnInit, OnDestroy {
  public formGroup!: FormGroup;
  private store = inject(Store);
  private destroy$ = new Subject<void>();
  public generating$!: Observable<boolean>;
  private filter = '';
  private count = 0;

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      frameRate: new FormControl('', Validators.required),
      codec: new FormControl('', Validators.required),
      resolution: new FormControl('', Validators.required),
      batch: new FormControl('', [Validators.required]),
      optimized: new FormControl(false),
    });

    this.store
      .select(selectScreenshotState)
      .pipe(
        tap((state) => {
          this.filter = state.filter;
          this.count = state.count;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
    this.generating$ = this.store.select(selectGenerateVideoState).pipe(
      map((state) => state.generating),
      takeUntil(this.destroy$)
    );

    this.store
      .select(selectSettingState)
      .pipe(
        tap((state) => this.formGroup.patchValue(state.videoConfig)),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.store.dispatch(settingActions.load());
  }

  public onCheck(checked: boolean) {
    this.formGroup.controls['optimized'].setValue(checked);
  }

  public get optimizedControl(): boolean {
    return this.formGroup.get('optimized')?.value;
  }

  onSubmit(): void {
    if (!this.count) {
      this.store.dispatch(
        generateVideoActions.failure({ error: 'No available frames' })
      );
      return;
    }
    if (this.formGroup.valid && this.count > 0) {
      this.store.dispatch(
        settingActions.update({ videoConfig: this.formGroup.value })
      );
      this.store.dispatch(
        generateVideoActions.start({
          config: this.formGroup.value,
          filter: this.filter
        })
      );
    } else {
      this.formGroup.markAllAsTouched(); // Mark all fields as touched to show validation errors
      console.log('Form is invalid');
      this.store.dispatch(
        generateVideoActions.failure({ error: 'Form is invalid' })
      );
    }
  }

  cancel() {
    this.store.dispatch(generateVideoActions.cancel());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
