import { createAction, props } from '@ngrx/store';
import { WishlistItem } from '../../core/models/wishlist.model';

export const loadWishlist = createAction('[Wishlist] Load Wishlist');

export const loadWishlistSuccess = createAction(
  '[Wishlist] Load Wishlist Success',
  props<{ items: WishlistItem[] }>()
);

export const loadWishlistFailure = createAction(
  '[Wishlist] Load Wishlist Failure',
  props<{ error: string }>()
);

export const addToWishlist = createAction(
  '[Wishlist] Add To Wishlist',
  props<{ productId: number }>()
);

export const addToWishlistSuccess = createAction(
  '[Wishlist] Add To Wishlist Success',
  props<{ item: WishlistItem }>()
);

export const addToWishlistFailure = createAction(
  '[Wishlist] Add To Wishlist Failure',
  props<{ error: string }>()
);

export const removeFromWishlist = createAction(
  '[Wishlist] Remove From Wishlist',
  props<{ productId: number }>()
);

export const removeFromWishlistSuccess = createAction(
  '[Wishlist] Remove From Wishlist Success',
  props<{ productId: number }>()
);

export const removeFromWishlistFailure = createAction(
  '[Wishlist] Remove From Wishlist Failure',
  props<{ error: string }>()
);

export const clearWishlist = createAction('[Wishlist] Clear Wishlist');

export const clearWishlistSuccess = createAction(
  '[Wishlist] Clear Wishlist Success'
);

export const clearWishlistFailure = createAction(
  '[Wishlist] Clear Wishlist Failure',
  props<{ error: string }>()
);