import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductState } from '../reducers/product.reducer';

export const selectProductState = createFeatureSelector<ProductState>('products');

export const selectAllProducts = createSelector(
  selectProductState,
  (state) => state.products
);

export const selectTotalProducts = createSelector(
  selectProductState,
  (state) => state.total
);

export const selectProductsLoading = createSelector(
  selectProductState,
  (state) => state.loading
);

export const selectProductsError = createSelector(
  selectProductState,
  (state) => state.error
);

export const selectProductById = (id: number) => createSelector(
  selectAllProducts,
  (products) => products.find(product => product.id === id)
);

export const selectProductsByCategory = (category: string) => createSelector(
  selectAllProducts,
  (products) => products.filter(product => product.category === category)
);

export const selectInStockProducts = createSelector(
  selectAllProducts,
  (products) => products.filter(product => product.stock > 0)
);