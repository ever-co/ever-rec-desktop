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
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    MatTooltipModule,
  ],
  templateUrl: './photo.component.html',
  styleUrl: './photo.component.scss',
})
export class PhotoComponent implements OnDestroy, OnDestroy {
  @Input() photo!: IPhoto;

  @Input()
  public checked: boolean | null = false;

  @Input()
  public actionButtons: IActionButton[] = [];

  @Output()
  public selected = new EventEmitter<ISelected<IPhoto>>();

  private destroy$ = new Subject<void>();

  public onSelected({ checked }: MatCheckboxChange): void {
    this.checked = checked;
    this.selected.emit({
      data: this.photo,
      selected: checked,
    });
  }

  public handle(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
  }

  public adapter(photo: IPhoto): ISelected<IPhoto>[] {
    return [
      {
        data: photo,
        selected: this.checked || false,
      },
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
