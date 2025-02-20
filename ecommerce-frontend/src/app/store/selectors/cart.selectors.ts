import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from '../reducers/cart.reducer';

export const selectCartState = createFeatureSelector<CartState>('cart');

export const selectCartItems = createSelector(
  selectCartState,
  (state) => state.items
);

export const selectCartLoading = createSelector(
  selectCartState,
  (state) => state.loading
);

export const selectCartError = createSelector(
  selectCartState,
  (state) => state.error
);

export const selectCartTotal = createSelector(
  selectCartItems,
  (items) => items.reduce((total, item) =>
    total + (item.product.price * item.quantity), 0)
);

export const selectCartItemCount = createSelector(
  selectCartItems,
  (items) => items.reduce((count, item) => count + item.quantity, 0)
);

export const selectCartItemById = (productId: number) => createSelector(
  selectCartItems,
  (items) => items.find(item => item.product.id === productId)
);