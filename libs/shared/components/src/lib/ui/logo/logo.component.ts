
import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-logo',
  imports: [RouterLink],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoComponent {
  src = input<string>('assets/logo.svg');

  isTablet = input<boolean, unknown>(false, { transform: booleanAttribute });

  alt = input<string>('Ever Rec');

  width = input<number>(32);

  height = input<number>(32);

  ariaLabel = input<string | undefined>(undefined);

  routerLink = input<string | unknown[] | undefined>(undefined);

  readonly effectiveSrc = computed(() =>
    this.isTablet() ? 'assets/logo-min.svg' : this.src(),
  );

  readonly effectiveAriaLabel = computed(() => this.ariaLabel() ?? this.alt());
}
