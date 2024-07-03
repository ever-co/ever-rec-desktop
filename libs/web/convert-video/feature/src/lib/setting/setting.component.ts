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
      codec: new FormControl('libx264', Validators.required),
      resolution: new FormControl('1920:1080', Validators.required),
      duration: new FormControl('60', Validators.required),
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
      this.store.dispatch(
        generateVideoActions.start({
          screenshotIds: this.screenshotIds,
          config: this.formGroup.value,
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
