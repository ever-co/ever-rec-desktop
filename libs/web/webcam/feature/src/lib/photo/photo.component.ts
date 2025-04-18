import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActionButtonGroupComponent,
  ConfirmationDialogService,
  NoDataComponent,
} from '@ever-co/shared-components';
import {
  HumanizeBytesPipe,
  ImgFallbackDirective,
  PopoverDirective,
  UtcToLocalTimePipe,
} from '@ever-co/shared-service';
import { IActionButton, IPhoto } from '@ever-co/shared-utils';
import { photoActions, selectPhotoState } from '@ever-co/webcam-data-access';
import { Store } from '@ngrx/store';
import {
  filter,
  lastValueFrom,
  map,
  Observable,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'lib-photo',
  imports: [
    CommonModule,
    NoDataComponent,
    UtcToLocalTimePipe,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    HumanizeBytesPipe,
    PopoverDirective,
    ActionButtonGroupComponent,
    ImgFallbackDirective,
  ],
  templateUrl: './photo.component.html',
  styleUrl: './photo.component.scss',
})
export class PhotoComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public actionButtons: IActionButton[] = [
    {
      icon: 'delete',
      label: 'Delete',
      variant: 'danger',
      action: this.delete.bind(this),
    },
  ];
  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly store: Store,
    private readonly confirationDialogService: ConfirmationDialogService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        filter(Boolean),
        tap(async (params) => {
          if (params['id']) {
            this.store.dispatch(
              photoActions.loadPhoto({
                where: {
                  id: params['id'],
                },
                relations: ['metadata'],
              })
            );
          } else {
            await this.router.navigate(['/dashboard']);
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  public get photo$(): Observable<IPhoto | null> {
    return this.store.select(selectPhotoState).pipe(
      map((state) => state.photo),
      takeUntil(this.destroy$)
    );
  }

  public get isLoading$(): Observable<boolean> {
    return this.store.select(selectPhotoState).pipe(
      map((state) => state.loading),
      takeUntil(this.destroy$)
    );
  }

  public async delete(photo: IPhoto) {
    const isConfirmed = await lastValueFrom(
      this.confirationDialogService.open({
        title: 'Delete Photo',
        message: 'Are you sure you want to delete this photo?',
        variant: 'danger',
      })
    );
    if (isConfirmed) {
      this.store.dispatch(photoActions.deletePhoto(photo));
      await this.router.navigate(['/', 'library', 'photos']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
