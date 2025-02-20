import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import * as AuthActions from '../actions/auth.actions';
import { AuthResponse } from '../../core/models/auth.model';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ email, password }) =>
        this.authService.login(email, password).pipe(
          map((response: AuthResponse) => {
            const user = this.authService.getCurrentUserFromToken(response.access_token);
            return AuthActions.loginSuccess({
              user,
              token: response.access_token
            });
          }),
          catchError((error: HttpErrorResponse) =>
            of(AuthActions.loginFailure({ error: error.error?.message || 'Login failed' }))
          )
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ token }) => {
          localStorage.setItem('token', token);
          this.router.navigate(['/']);
          this.notificationService.showNotification(
            'Login successful',
            'success'
          );
        })
      ),
    { dispatch: false }
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      mergeMap(({ email, password, name }) =>
        this.authService.register({ email, password, name }).pipe(
          map(() => AuthActions.registerSuccess()),
          catchError((error: HttpErrorResponse) =>
            of(AuthActions.registerFailure({ error: error.error?.message || 'Registration failed' }))
          )
        )
      )
    )
  );

  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(() => {
          this.router.navigate(['/auth/login']);
          this.notificationService.showNotification(
            'Registration successful. Please login.',
            'success'
          );
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          localStorage.removeItem('token');
          this.router.navigate(['/auth/login']);
          this.notificationService.showNotification(
            'Logged out successfully',
            'success'
          );
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) { }
}