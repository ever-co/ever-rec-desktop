import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { selectUser } from '@ever-co/auth-data-access';
import { LayoutService, PopoverDirective } from '@ever-co/shared-service';
import { IUser } from '@ever-co/shared-utils';
import { AvatarComponent } from '@ever-co/user-ui';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthPopupComponent } from '../auth-popup/auth-popup.component';

@Component({
  selector: 'lib-auth-badge',
  imports: [
    CommonModule,
    AuthPopupComponent,
    AvatarComponent,
    PopoverDirective,
  ],
  templateUrl: './auth-badge.component.html',
  styleUrl: './auth-badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthBadgeComponent {
  constructor(
    public readonly layoutService: LayoutService,
    private readonly store: Store,
  ) {}

  public get user$(): Observable<IUser | null> {
    return this.store.select(selectUser);
  }
}
