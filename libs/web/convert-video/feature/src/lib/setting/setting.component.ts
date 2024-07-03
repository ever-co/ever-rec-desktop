import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
      frameRate: new FormControl('30'),
      codec: new FormControl('libx264'),
      resolution: new FormControl('1920x1080'),
      duration: new FormControl('600'),
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

  onSubmit(): void {
    if (this.formGroup.valid && this.screenshotIds.length > 0) {
      const formData = this.formGroup.value;
      console.log('Form Data:', formData);
      this.store.dispatch(
        generateVideoActions.start({
          screenshotIds: this.screenshotIds,
          config: formData,
        })
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
