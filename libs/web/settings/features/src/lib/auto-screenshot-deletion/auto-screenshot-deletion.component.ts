import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NotificationService } from '@ever-co/notification-data-access';
import {
  selectSettingStorageState,
  settingStorageActions,
} from '@ever-co/web-setting-data-access';
import { Store } from '@ngrx/store';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
    selector: 'lib-auto-screenshot-deletion',
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatSlideToggleModule,
    ],
    templateUrl: './auto-screenshot-deletion.component.html',
    styleUrl: './auto-screenshot-deletion.component.scss'
})
export class AutoScreenshotDeletionComponent implements OnInit, OnDestroy {
  public form!: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(
    private readonly store: Store,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      autoScreenshotDeletion: new FormControl(false),
    });
    this.store
      .select(selectSettingStorageState)
      .pipe(
        tap(({ autoScreenshotDeletion }) =>
          this.form.patchValue({ autoScreenshotDeletion })
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  public onSubmit(): void {
    this.store.dispatch(settingStorageActions.update(this.form.value));
    this.notificationService.show('Storage optimization config updated', 'info');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
