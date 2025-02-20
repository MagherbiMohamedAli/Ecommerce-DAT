import { AuthEffects } from './auth.effects';
import { CartEffects } from './cart.effects';
import { ProductEffects } from './product.effects';
import { WishlistEffects } from './wishlist.effects';

export const effects = [
  AuthEffects,
  ProductEffects,
  CartEffects,
  WishlistEffects
];