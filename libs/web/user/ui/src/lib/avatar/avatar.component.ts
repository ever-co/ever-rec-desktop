import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  type Signal,
} from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IUser } from '@ever-co/shared-utils';

@Component({
  selector: 'lib-user-avatar',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, NgOptimizedImage],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  /** The user object containing name and optional image URL */
  readonly user = input<IUser | null>(null);

  /** Whether to display the user's name next to the avatar */
  readonly showName = input(false, { alias: 'show-name' });

  /** Size of the avatar (small, medium, large) */
  readonly size = input<'sm' | 'md' | 'lg' | 'xl'>('md');

  /** Whether to display a tooltip with the user's name */
  readonly showTooltip = input(true, { alias: 'show-tooltip' });

  /** Whether to display a tooltip with the user's name */
  readonly showEmail = input(false, { alias: 'show-email' });

  /** Custom CSS classes to apply to the avatar container */
  readonly customClass = input('');

  /** Computed user name with fallback to empty string */
  readonly name: Signal<string> = computed(() => this.user()?.name ?? '');

  /** Computed user email with fallback to empty string */
  readonly email: Signal<string> = computed(() => this.user()?.email ?? '');

  /** Computed image URL with fallback to null */
  readonly imageUrl: Signal<string | null> = computed(
    () => this.user()?.imageUrl ?? null,
  );

  /** Computed whether to show tooltip (only when enabled AND name exists) */
  readonly shouldShowTooltip: Signal<boolean> = computed(
    () => this.showTooltip() && this.name().length > 0,
  );

  /** Computed initials from the user's name */
  readonly initials: Signal<string> = computed(() => {
    const name = this.name();
    if (!name.trim()) return '';

    return name
      .split(' ')
      .filter((part) => part.length > 0)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  });

  /** Computed size classes based on the size input */
  readonly sizeClasses: Signal<string> = computed(() => {
    switch (this.size()) {
      case 'sm':
        return 'w-8 h-8 text-xs';
      case 'lg':
        return 'w-14 h-14 text-lg';
      case 'xl':
        return 'w-18 h-18 text-xl';
      case 'md':
      default:
        return 'w-10 h-10 sm:w-12 sm:h-12 text-sm';
    }
  });
}
