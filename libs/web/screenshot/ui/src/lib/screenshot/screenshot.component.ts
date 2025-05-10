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
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActionButtonGroupComponent } from '@ever-co/shared-components';
import {
  IconFallbackDirective,
  ImgFallbackDirective,
  PopoverDirective,
  UtcToLocalTimePipe,
} from '@ever-co/shared-service';
import { IActionButton, IScreenshot, ISelected } from '@ever-co/shared-utils';
import { Subject } from 'rxjs';

@Component({
  selector: 'lib-screenshot',
  imports: [
    CommonModule,
    MatCardModule,
    UtcToLocalTimePipe,
    PopoverDirective,
    MatIconModule,
    MatButtonModule,
    ActionButtonGroupComponent,
    ImgFallbackDirective,
    IconFallbackDirective,
    MatCheckboxModule,
    MatTooltipModule,
  ],
  templateUrl: './screenshot.component.html',
  styleUrl: './screenshot.component.scss',
})
export class ScreenshotComponent implements OnDestroy, OnDestroy {
  private destroy$ = new Subject<void>();
  @Input() screenshot!: IScreenshot;

  @Input()
  public checked: boolean | null = false;

  @Input()
  public actionButtons: IActionButton[] = [];

  @Output()
  public selected = new EventEmitter<ISelected<IScreenshot>>();

  public onSelected(checked: boolean): void {
    this.checked = checked;
    this.selected.emit({
      data: this.screenshot,
      selected: checked,
    });
  }

  public adapter(data: IScreenshot): ISelected<IScreenshot>[] {
    return [
      {
        data,
        selected: this.checked || false,
      },
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
