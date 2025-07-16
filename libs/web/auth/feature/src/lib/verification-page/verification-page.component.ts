import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  authActions,
  selectAuthLoading,
  selectCooldown,
} from '@ever-co/auth-data-access';
import { AuthContainerComponent } from '@ever-co/auth-ui';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'lib-verification-page',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    AuthContainerComponent,
  ],
  templateUrl: './verification-page.component.html',
  styleUrl: './verification-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerificationPageComponent implements OnInit, OnDestroy {
  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(authActions.startVerificationPolling());
  }

  ngOnDestroy(): void {
    this.store.dispatch(authActions.stopVerificationPolling());
  }

  public get loading$(): Observable<boolean> {
    return this.store.select(selectAuthLoading);
  }

  public get cooldown$(): Observable<number> {
    return this.store.select(selectCooldown);
  }

  public backToLogin(): void {
    this.store.dispatch(authActions.logout());
  }

  public verify(): void {
    this.store.dispatch(authActions.sendVerificationEmail());
  }
}
