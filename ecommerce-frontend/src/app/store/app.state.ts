import { AuthState } from './reducers/auth.reducer';
import { CartState } from './reducers/cart.reducer';
import { ProductState } from './reducers/product.reducer';
import { WishlistState } from './reducers/wishlist.reducer';

export interface AppState {
  auth: AuthState;
  products: ProductState;
  cart: CartState;
  wishlist: WishlistState;
}