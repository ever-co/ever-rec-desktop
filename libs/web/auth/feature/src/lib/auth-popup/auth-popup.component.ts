import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { authActions } from '@ever-co/auth-data-access';
import { ActionButtonGroupComponent } from '@ever-co/shared-components';
import { IActionButton } from '@ever-co/shared-utils';
import { Store } from '@ngrx/store';

@Component({
  selector: 'lib-logout-button',
  imports: [ActionButtonGroupComponent],
  templateUrl: './logout-button.component.html',
  styleUrl: './logout-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPopupComponent {
  private readonly store = inject(Store);
  public readonly buttons: IActionButton[] = [
    {
      icon: 'logout',
      label: 'Logout',
      variant: 'danger',
      action: this.logout.bind(this),
    },
  ];

  private logout(): void {
    this.store.dispatch(authActions.logout());
  }
}
