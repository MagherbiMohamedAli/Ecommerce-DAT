import { ActionReducerMap } from '@ngrx/store';
import { AppState } from '../app.state';
import { authReducer } from './auth.reducer';
import { productReducer } from './product.reducer';
import { wishlistReducer } from './wishlist.reducer';
import { cartReducer } from './cart.reducer';

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  products: productReducer,
  cart: cartReducer,
  wishlist: wishlistReducer
};
