import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { CartService } from '../../core/services/cart.service';
import { NotificationService } from '../../core/services/notification.service';
import * as CartActions from '../actions/cart.actions';

@Injectable()
export class CartEffects {
  loadCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.loadCart),
      mergeMap(() =>
        this.cartService.getCart().pipe(
          map(items => CartActions.loadCartSuccess({ items })),
          catchError(error =>
            of(CartActions.loadCartFailure({ error: error.message }))
          )
        )
      )
    )
  );

  addToCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.addToCart),
      mergeMap(({ productId, quantity }) =>
        this.cartService.addToCart({ productId, quantity }).pipe(
          map(item => CartActions.addToCartSuccess({ item })),
          tap(() => {
            this.notificationService.showNotification(
              'Product added to cart',
              'success'
            );
          }),
          catchError(error =>
            of(CartActions.addToCartFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateCartQuantity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.updateCartQuantity),
      mergeMap(({ productId, quantity }) =>
        this.cartService.updateQuantity(productId, quantity).pipe(
          map(item => CartActions.updateCartQuantitySuccess({ item })),
          tap(() => {
            this.notificationService.showNotification(
              'Cart updated',
              'success'
            );
          }),
          catchError(error =>
            of(CartActions.updateCartQuantityFailure({ error: error.message }))
          )
        )
      )
    )
  );

  removeFromCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.removeFromCart),
      mergeMap(({ productId }) =>
        this.cartService.removeFromCart(productId).pipe(
          map(() => CartActions.removeFromCartSuccess({ productId })),
          tap(() => {
            this.notificationService.showNotification(
              'Product removed from cart',
              'success'
            );
          }),
          catchError(error =>
            of(CartActions.removeFromCartFailure({ error: error.message }))
          )
        )
      )
    )
  );

  clearCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.clearCart),
      mergeMap(() =>
        this.cartService.clearCart().pipe(
          map(() => CartActions.clearCartSuccess()),
          tap(() => {
            this.notificationService.showNotification(
              'Cart cleared',
              'success'
            );
          }),
          catchError(error =>
            of(CartActions.clearCartFailure({ error: error.message }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private cartService: CartService,
    private notificationService: NotificationService
  ) { }
}
