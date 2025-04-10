import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import {
  screenshotActions,
  ScreenshotElectronService,
} from '@ever-co/screenshot-data-access';
import {
  ActionButtonGroupComponent,
  ConfirmationDialogService,
  NoDataComponent,
  VideoComponent,
} from '@ever-co/shared-components';
import {
  CopyToClipboardDirective,
  HumanizeBytesPipe,
  IconFallbackDirective,
  ImgFallbackDirective,
  PopoverDirective,
  UtcToLocalTimePipe,
} from '@ever-co/shared-service';
import { IActionButton, IScreenshot } from '@ever-co/shared-utils';
import { Store } from '@ngrx/store';
import { concatMap, filter, lastValueFrom, Observable } from 'rxjs';

@Component({
    selector: 'lib-screenshot',
    imports: [
        CommonModule,
        NoDataComponent,
        UtcToLocalTimePipe,
        MatCardModule,
        MatIconModule,
        MatChipsModule,
        VideoComponent,
        HumanizeBytesPipe,
        PopoverDirective,
        ActionButtonGroupComponent,
        CopyToClipboardDirective,
        ImgFallbackDirective,
        IconFallbackDirective,
    ],
    templateUrl: './screenshot.component.html',
    styleUrl: './screenshot.component.scss'
})
export class ScreenshotComponent implements OnInit {
  public screenshot$!: Observable<IScreenshot | null>;
  public actionButtons: IActionButton[] = [
    {
      icon: 'copy',
      label: 'Duplicate',
      variant: 'default',
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
    private readonly activatedRoute: ActivatedRoute,
    private readonly screenshotService: ScreenshotElectronService,
    private readonly store: Store,
    private readonly confirationDialogService: ConfirmationDialogService
  ) {}
  ngOnInit(): void {
    this.screenshot$ = this.activatedRoute.params.pipe(
      filter(Boolean),
      concatMap(async (params) => {
        if (params['id']) {
          return this.screenshotService.getOneScreenshot({
            where: {
              id: params['id'],
            },
            relations: ['metadata', 'metadata.application', 'video'],
          });
        } else {
          await this.router.navigate(['/dashboard']);
          return null;
        }
      })
    );
    if (this.data) {
      this.screenshot$ = new Observable((observer) => observer.next(this.data));
    }
  }

  private _data!: IScreenshot | null;

  @Input()
  public get data(): IScreenshot | null {
    return this._data;
  }

  public set data(value: IScreenshot | null) {
    this._data = value;
  }

  public async delete(screenshot: IScreenshot) {
    const isConfirmed = await lastValueFrom(
      this.confirationDialogService.open({
        title: 'Delete Screenshot',
        message: 'Are you sure you want to delete this screenshot?',
        variant: 'danger',
      })
    );
    if (isConfirmed) {
      this.store.dispatch(screenshotActions.deleteScreenshot(screenshot));
      await this.router.navigate(['/', 'library', 'screenshots']);
    }
  }
}
