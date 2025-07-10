import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  authActions,
  selectAuthLoading,
  selectUser,
} from '@ever-co/auth-data-access';
import { ActionButtonGroupComponent } from '@ever-co/shared-components';
import { IActionButton, IUser } from '@ever-co/shared-utils';
import { AvatarComponent } from '@ever-co/user-ui';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'lib-auth-popup',
  imports: [CommonModule, ActionButtonGroupComponent, AvatarComponent],
  templateUrl: './auth-popup.component.html',
  styleUrl: './auth-popup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPopupComponent {
  private readonly store = inject(Store);
  public readonly buttons: IActionButton[] = [
    {
      label: 'Profile',
      icon: 'person',
    },
    {
      label: 'Account Settings',
      icon: 'settings',
    },
    {
      icon: 'logout',
      label: 'Logout',
      variant: 'danger',
      loading: this.store.select(selectAuthLoading),
      action: this.logout.bind(this),
    },
  ];

  public get user$(): Observable<IUser | null> {
    return this.store.select(selectUser);
  }

  private logout(): void {
    this.store.dispatch(authActions.logout());
  }
}
