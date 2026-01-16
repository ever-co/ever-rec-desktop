import { CommonModule } from '@angular/common';

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  authActions,
  selectAuthLoading,
  selectDeletingAccount,
  selectUser,
} from '@ever-co/auth-data-access';
import { ActionButtonComponent } from '@ever-co/shared-components';
import { FileInput, IActionButton, IFile, IUser } from '@ever-co/shared-utils';

import {
  IEmail,
  IFullName,
  IPassword,
  selectAvatarUploading,
  selectEmailUpdateError,
  selectEmailUpdating,
  selectFullNameUpdateError,
  selectFullNameUpdating,
  selectPasswordUpdateError,
  selectPasswordUpdating,
  userUpdateActions,
} from '@ever-co/user-data-access';
import {
  AvatarComponent,
  EmailFormComponent,
  IPasswordConfig,
  NameFormComponent,
  PasswordDialogValidationComponent,
  PasswordFormComponent,
} from '@ever-co/user-ui';
import { Store } from '@ngrx/store';
import { filter, Observable, take, tap } from 'rxjs';

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
export class UserProfileComponent implements OnDestroy {
  public readonly accordion = viewChild.required(MatAccordion);
  private readonly store = inject(Store);
  private readonly dialogService = inject(MatDialog);
  public readonly deleteButton: IActionButton = {
    icon: 'dangerous',
    label: 'Delete',
    variant: 'danger',
    loading: this.store.select(selectDeletingAccount),
    action: this.deleteAccount.bind(this),
  };

  public readonly signOutButton: IActionButton = {
    icon: 'logout',
    label: 'Sign Out',
    loading: this.store.select(selectAuthLoading),
    action: this.signOut.bind(this),
  };

  public readonly passwordConfig: IPasswordConfig = {
    submit: {
      loading: this.store.select(selectPasswordUpdating),
    },
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

  public get fullNameError$(): Observable<string | null> {
    return this.store.select(selectFullNameUpdateError);
  }

  public get emailError$(): Observable<string | null> {
    return this.store.select(selectEmailUpdateError);
  }

  public get passwordUpdating$(): Observable<boolean> {
    return this.store.select(selectPasswordUpdating);
  }

  public get avatarUploading$(): Observable<boolean> {
    return this.store.select(selectAvatarUploading);
  }

  public get passwordError$(): Observable<string | null> {
    return this.store.select(selectPasswordUpdateError);
  }

  private signOut(): void {
    this.store.dispatch(authActions.logout());
  }

  public updateName(input: IFullName): void {
    this.store.dispatch(userUpdateActions.fullName(input));
  }

  public updateEmail(email: IEmail): void {
    this.dialogService
      .open(PasswordDialogValidationComponent)
      .afterClosed()
      .pipe(
        take(1),
        filter(Boolean),
        tap((password: IPassword) =>
          this.store.dispatch(
            userUpdateActions.email({
              ...password,
              ...email,
            }),
          ),
        ),
      )
      .subscribe();
  }

  public updatePassword({ password }: IPassword): void {
    this.dialogService
      .open(PasswordDialogValidationComponent)
      .afterClosed()
      .pipe(
        take(1),
        filter(Boolean),
        tap(({ password: oldPassword }: IPassword) =>
          this.store.dispatch(
            userUpdateActions.password({
              oldPassword,
              password,
            }),
          ),
        ),
      )
      .subscribe();
  }

  private deleteAccount(): void {
    this.dialogService
      .open(PasswordDialogValidationComponent)
      .afterClosed()
      .pipe(
        take(1),
        filter(Boolean),
        tap((password: IPassword) => {
          this.store.dispatch(authActions.delete(password));
        }),
      )
      .subscribe();
  }

  @FileInput()
  public updateAvatar(file: IFile): void {
    this.store.dispatch(userUpdateActions.uploadAvatar({ file }));
  }

  ngOnDestroy(): void {
    this.store.dispatch(userUpdateActions.reset());
  }
}
