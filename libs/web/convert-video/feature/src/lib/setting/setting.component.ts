import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { generateVideoActions } from '@prototype/web/convert-video/data-access';
import { selectScreenshotState } from '@prototype/web/screenshot/data-access';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'lib-setting',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss',
})
export class SettingComponent implements OnInit, OnDestroy {
  public formGroup!: FormGroup;
  private store = inject(Store);
  private screenshotIds: string[] = [];
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      frameRate: new FormControl('30', Validators.required),
      patternType: new FormControl('glob', Validators.required),
      width: new FormControl('auto', [
        Validators.required,
        this.validateAutoOrNumber,
      ]),
      height: new FormControl('auto', [
        Validators.required,
        this.validateAutoOrNumber,
      ]),
      imageFormat: new FormControl('png', Validators.required),
      videoFormat: new FormControl('mp4', Validators.required),
    });
    this.store
      .select(selectScreenshotState)
      .pipe(
        tap(
          (state) =>
            (this.screenshotIds = state.screenshots.map(
              ({ id }) => id
            ) as string[])
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private validateAutoOrNumber(
    control: FormControl
  ): { [key: string]: boolean } | null {
    const value = control.value;
    return value === 'auto' || !isNaN(parseInt(value, 10))
      ? null
      : { invalidValue: true };
  }

  onSubmit(): void {
    if (this.formGroup.valid && this.screenshotIds.length > 0) {
      const formData = this.formGroup.value;
      console.log('Form Data:', formData);
      this.store.dispatch(
        generateVideoActions.start({ screenshotIds: this.screenshotIds })
      );
    } else {
      this.formGroup.markAllAsTouched(); // Mark all fields as touched to show validation errors
      console.log('Form is invalid');
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
