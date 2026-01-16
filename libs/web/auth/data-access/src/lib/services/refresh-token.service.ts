import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { timer, Subscription, filter, switchMap, take, tap } from 'rxjs';
import { authActions } from '../state+/auth.action';
import { selectIsAuthenticated } from '../state+/auth.selector';

@Injectable({
  providedIn: 'root',
})
export class RefreshTokenService {
  private refreshSubscription?: Subscription;
  private readonly checkInterval = 5 * 60 * 1000; // 5 minutes
  private readonly startDue = 3 * 60 * 1000; // 3 minutes

  constructor(private store: Store) {}

  public startTimer(): void {
    this.stopTimer();

    this.refreshSubscription = timer(this.startDue, this.checkInterval)
      .pipe(
        // Check authentication status each time the interval fires
        switchMap(() => this.store.select(selectIsAuthenticated).pipe(take(1))),
        // Only proceed if authenticated
        filter(Boolean),
        // Dispatch refresh action
        tap(() => this.store.dispatch(authActions.refreshToken())),
      )
      .subscribe();
  }

  public stopTimer(): void {
    this.refreshSubscription?.unsubscribe();
  }
}
