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
import { ActionButtonGroupComponent } from '@ever-co/shared-components';
import {
  ImgFallbackDirective,
  PopoverDirective,
  UtcToLocalTimePipe,
} from '@ever-co/shared-service';
import { IActionButton, IPhoto, ISelected } from '@ever-co/shared-utils';
import { Subject } from 'rxjs';

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

  @Output()
  public deleted = new EventEmitter<IPhoto>();

  @Output()
  public viewed = new EventEmitter<IPhoto>();

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

  public view(photo: IPhoto): void {
    this.viewed.emit(photo);
  }

  public onSelected(checked: boolean): void {
    this.checked = checked;
    this.selected.emit({
      data: this.photo,
      selected: checked,
    });
  }

  public delete(photo: IPhoto) {
    this.deleted.emit(photo);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
