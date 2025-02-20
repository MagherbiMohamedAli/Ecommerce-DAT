import { createReducer, on } from '@ngrx/store';
import { CartItem } from '../../core/models/cart.model';
import * as CartActions from '../actions/cart.actions';

export interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  total: number;
}

export const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  total: 0
};

export const cartReducer = createReducer(
  initialState,

  // Load Cart
  on(CartActions.loadCart, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CartActions.loadCartSuccess, (state, { items }) => ({
    ...state,
    items,
    loading: false,
    total: calculateTotal(items),
    error: null
  })),

  on(CartActions.loadCartFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(CartActions.addToCart, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CartActions.addToCartSuccess, (state, { item }) => ({
    ...state,
    items: [...state.items, item],
    total: calculateTotal([...state.items, item]),
    loading: false
  })),

  on(CartActions.addToCartFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(CartActions.updateCartQuantity, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CartActions.updateCartQuantitySuccess, (state, { item }) => ({
    ...state,
    items: state.items.map(existingItem =>
      existingItem.product.id === item.product.id ? item : existingItem
    ),
    total: calculateTotal(state.items.map(existingItem =>
      existingItem.product.id === item.product.id ? item : existingItem
    )),
    loading: false
  })),

  on(CartActions.updateCartQuantityFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(CartActions.removeFromCart, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CartActions.removeFromCartSuccess, (state, { productId }) => ({
    ...state,
    items: state.items.filter(item => item.product.id !== productId),
    total: calculateTotal(state.items.filter(item => item.product.id !== productId)),
    loading: false
  })),

  on(CartActions.removeFromCartFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(CartActions.clearCart, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CartActions.clearCartSuccess, (state) => ({
    ...state,
    items: [],
    total: 0,
    loading: false
  })),

  on(CartActions.clearCartFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);

function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) =>
    sum + (item.product.price * item.quantity), 0
  );
}