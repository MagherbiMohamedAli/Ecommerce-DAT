import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { WishlistService } from '../../core/services/wishlist.service';
import { NotificationService } from '../../core/services/notification.service';
import * as WishlistActions from '../actions/wishlist.actions';

@Injectable()
export class WishlistEffects {
  loadWishlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WishlistActions.loadWishlist),
      mergeMap(() =>
        this.wishlistService.getWishlist().pipe(
          map(items => WishlistActions.loadWishlistSuccess({ items })),
          catchError(error =>
            of(WishlistActions.loadWishlistFailure({ error: error.message }))
          )
        )
      )
    )
  );

  addToWishlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WishlistActions.addToWishlist),
      mergeMap(({ productId }) =>
        this.wishlistService.addToWishlist({ productId }).pipe(
          map(item => WishlistActions.addToWishlistSuccess({ item })),
          tap(() => {
            this.notificationService.showNotification(
              'Product added to wishlist',
              'success'
            );
          }),
          catchError(error =>
            of(WishlistActions.addToWishlistFailure({ error: error.message }))
          )
        )
      )
    )
  );

  removeFromWishlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WishlistActions.removeFromWishlist),
      mergeMap(({ productId }) =>
        this.wishlistService.removeFromWishlist(productId).pipe(
          map(() => WishlistActions.removeFromWishlistSuccess({ productId })),
          tap(() => {
            this.notificationService.showNotification(
              'Product removed from wishlist',
              'success'
            );
          }),
          catchError(error =>
            of(WishlistActions.removeFromWishlistFailure({ error: error.message }))
          )
        )
      )
    )
  );

  clearWishlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WishlistActions.clearWishlist),
      mergeMap(() =>
        this.wishlistService.clearWishlist().pipe(
          map(() => WishlistActions.clearWishlistSuccess()),
          tap(() => {
            this.notificationService.showNotification(
              'Wishlist cleared',
              'success'
            );
          }),
          catchError(error =>
            of(WishlistActions.clearWishlistFailure({ error: error.message }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private wishlistService: WishlistService,
    private notificationService: NotificationService
  ) { }
}