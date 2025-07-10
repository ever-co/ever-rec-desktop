import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { selectUser } from '@ever-co/auth-data-access';
import { IUser } from '@ever-co/shared-utils';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthPopupComponent } from '../auth-popup/auth-popup.component';
import { AvatarComponent } from '@ever-co/user-ui';
import { LayoutService, PopoverDirective } from '@ever-co/shared-service';

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
