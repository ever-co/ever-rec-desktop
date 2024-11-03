import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IActionButton } from '@ever-co/shared-utils';

@Component({
  selector: 'lib-action-button',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './action-button.component.html',
  styleUrl: './action-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionButtonComponent {
  @Input() data!: any;
  @Input() button!: IActionButton;
  @Output() actionTriggered = new EventEmitter<void>();

  public getButtonClasses(): string {
    const baseClasses =
      'group flex items-center rounded-lg p-2 transition-colors duration-200';
    const variantClasses = {
      default: 'hover:bg-gray-200',
      danger: 'hover:bg-red-50',
      warning: 'hover:bg-yellow-50',
      success: 'hover:bg-green-50',
    };

    return `${baseClasses} ${variantClasses[this.button.variant || 'default']}`;
  }

  public getIconClasses(): string {
    const baseClasses = 'transition-colors duration-200';
    const variantClasses = {
      default: 'group-hover:text-gray-600',
      danger: 'group-hover:text-red-600',
      warning: 'group-hover:text-yellow-600',
      success: 'group-hover:text-green-600',
    };

    return `${baseClasses} ${
      variantClasses[this.button.variant || 'default']
    } ${this.getSizeClasses()}`;
  }

  public getLabelClasses(): string {
    const variantClasses = {
      default: 'group-hover:text-gray-600',
      danger: 'group-hover:text-red-600',
      warning: 'group-hover:text-yellow-600',
      success: 'group-hover:text-green-600',
    };

    return variantClasses[this.button.variant || 'default'].concat(
      ` ${this.getSizeClasses()}`
    );
  }

  public getSizeClasses(): string {
    const variantClasses = {
      large: 'text-lg',
      medium: 'text-md',
      small: 'text-sm',
    };

    return variantClasses[this.button.size || 'medium'];
  }

  public getSpinnerColor(): string {
    const variantClasses = {
      default: 'gray',
      danger: 'red',
      warning: 'rgb(202 138 4)',
      success: 'green',
    };

    return variantClasses[this.button.variant || 'default'];
  }

  public getIconColor(): string {
    return this.button.variant === 'danger' ? 'warn' : '';
  }

  public onAction(): void {
    if (this.button.action) {
      this.button.action(this.data);
    }
    this.actionTriggered.emit();
  }
}
