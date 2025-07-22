import { CommonModule } from '@angular/common';

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  authActions,
  selectAuthLoading,
  selectUser,
} from '@ever-co/auth-data-access';
import { ActionButtonComponent } from '@ever-co/shared-components';
import { IActionButton, IUser } from '@ever-co/shared-utils';
import {
  IEmail,
  IFullName,
  selectEmailUpdating,
  selectFullNameUpdating,
  userUpdateActions,
} from '@ever-co/user-data-access';
import {
  AvatarComponent,
  EmailFormComponent,
  NameFormComponent,
  PasswordFormComponent,
} from '@ever-co/user-ui';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'lib-user-profile',
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    AvatarComponent,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatDividerModule,
    ActionButtonComponent,
    NameFormComponent,
    EmailFormComponent,
    PasswordFormComponent,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent {
  public readonly accordion = viewChild.required(MatAccordion);
  private readonly store = inject(Store);
  public readonly deleteButton: IActionButton = {
    icon: 'dangerous',
    label: 'Delete',
    variant: 'danger',
    action: this.deleteAccount.bind(this),
  };

  public readonly signOutButton: IActionButton = {
    icon: 'logout',
    label: 'Sign Out',
    loading: this.store.select(selectAuthLoading),
    action: this.signOut.bind(this),
  };

  public get user$(): Observable<IUser | null> {
    return this.store.select(selectUser);
  }

  public get fullNameUpdating$(): Observable<boolean> {
    return this.store.select(selectFullNameUpdating);
  }

  public get emailUpdating$(): Observable<boolean> {
    return this.store.select(selectEmailUpdating);
  }

  private signOut(): void {
    this.store.dispatch(authActions.logout());
  }

  public updateName(input: IFullName): void {
    this.store.dispatch(userUpdateActions.fullName(input));
  }

  public updateEmail(input: IEmail): void {
    //TODO: Implement update email
    console.log(input);
  }

  public updatePassword(input: {
    oldPassword: string;
    newPassword: string;
  }): void {
    //TODO: Implement update password
  }

  private deleteAccount(): void {
    //TODO: Implement delete account
  }

  public updateAvatar(): void {
    //TODO: Implement update avatar
  }
}
