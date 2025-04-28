import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import {
  ImgFallbackDirective,
  PopoverDirective,
  UtcToLocalTimePipe,
} from '@ever-co/shared-service';
import { IActionButton, IPhoto, ISelected } from '@ever-co/shared-utils';
import { photoActions } from '@ever-co/webcam-data-access';
import { Store } from '@ngrx/store';
import { filter, Subject, take, takeUntil, tap } from 'rxjs';
import { ActionButtonGroupComponent } from '../action-button-group/group/action-button-group.component';
import { ConfirmationDialogService } from '../dialogs/services/confirmation-dialog.service';

@Component({
  selector: 'lib-photo',
  imports: [
    CommonModule,
    MatCardModule,
    UtcToLocalTimePipe,
    PopoverDirective,
    MatIconModule,
    MatButtonModule,
    ActionButtonGroupComponent,
    ImgFallbackDirective,
    MatCheckboxModule,
  ],
  templateUrl: './photo.component.html',
  styleUrl: './photo.component.scss',
})
export class PhotoComponent implements OnDestroy, OnDestroy {
  @Input() photo!: IPhoto;

  @Input()
  public checked: boolean | null = false;

  @Output()
  public selected = new EventEmitter<ISelected<IPhoto>>();

  private destroy$ = new Subject<void>();

  public actionButtons: IActionButton[] = [
    {
      icon: 'visibility',
      label: 'View',
      variant: 'default',
      action: this.view.bind(this),
    },
    {
      icon: 'delete',
      label: 'Delete',
      variant: 'danger',
      action: this.delete.bind(this),
    },
  ];

  constructor(
    private readonly router: Router,
    private readonly store: Store,
    private readonly confirmationDialogService: ConfirmationDialogService
  ) {}

  public async view(): Promise<void> {
    await this.router.navigate([
      '/',
      'library',
      'webcams',
      'photos',
      this.photo.id,
    ]);
  }

  public onSelected(checked: boolean): void {
    this.checked = checked;
    this.selected.emit({
      data: this.photo,
      selected: checked,
    });
  }

  public delete(photo: IPhoto) {
    this.confirmationDialogService
      .open({
        title: 'Delete Photo',
        message: `Are you sure you want to delete this photo?`,
        variant: 'danger',
      })
      .pipe(
        take(1),
        filter(Boolean),
        tap(() => this.store.dispatch(photoActions.deletePhoto(photo))),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
