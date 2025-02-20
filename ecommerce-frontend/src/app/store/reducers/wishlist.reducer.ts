import { createReducer, on } from '@ngrx/store';
import { WishlistItem } from '../../core/models/wishlist.model';
import * as WishlistActions from '../actions/wishlist.actions';

export interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
}

export const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null
};

export const wishlistReducer = createReducer(
  initialState,
  on(WishlistActions.loadWishlist, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(WishlistActions.loadWishlistSuccess, (state, { items }) => ({
    ...state,
    items,
    loading: false,
    error: null
  })),
  on(WishlistActions.loadWishlistFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(WishlistActions.addToWishlistSuccess, (state, { item }) => ({
    ...state,
    items: [...state.items, item]
  })),
  on(WishlistActions.removeFromWishlistSuccess, (state, { productId }) => ({
    ...state,
    items: state.items.filter(item => item.product.id !== productId)
  })),
  on(WishlistActions.clearWishlistSuccess, (state) => ({
    ...state,
    items: []
  }))
);