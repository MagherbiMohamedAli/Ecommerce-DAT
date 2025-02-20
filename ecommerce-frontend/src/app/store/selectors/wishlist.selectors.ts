import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WishlistState } from '../reducers/wishlist.reducer';

export const selectWishlistState = createFeatureSelector<WishlistState>('wishlist');

export const selectWishlistItems = createSelector(
  selectWishlistState,
  (state) => state.items
);

export const selectWishlistLoading = createSelector(
  selectWishlistState,
  (state) => state.loading
);

export const selectWishlistError = createSelector(
  selectWishlistState,
  (state) => state.error
);

export const selectIsProductInWishlist = (productId: number) => createSelector(
  selectWishlistItems,
  (items) => items.some(item => item.product.id === productId)
);

export const selectWishlistItemCount = createSelector(
  selectWishlistItems,
  (items) => items.length
);