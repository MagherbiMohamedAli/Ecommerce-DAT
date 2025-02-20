import { createReducer, on } from '@ngrx/store';
import { Product } from '../../core/models/product.model';
import * as ProductActions from '../actions/product.actions';


export interface ProductState {
  products: Product[];
  total: number;
  loading: boolean;
  error: string | null;
}


export const initialState: ProductState = {
  products: [],
  total: 0,
  loading: false,
  error: null
};

export const productReducer = createReducer(
  initialState,
  on(ProductActions.loadProducts, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ProductActions.loadProductsSuccess, (state, { paginatedProducts }) => ({
    ...state,
    products: paginatedProducts.items,
    total: paginatedProducts.total,
    loading: false,
    error: null
  })),
  on(ProductActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(ProductActions.createProductSuccess, (state, { product }) => ({
    ...state,
    products: [...state.products, product]
  })),
  on(ProductActions.updateProductSuccess, (state, { product }) => ({
    ...state,
    products: state.products.map(p =>
      p.id === product.id ? product : p
    )
  })),
  on(ProductActions.deleteProductSuccess, (state, { id }) => ({
    ...state,
    products: state.products.filter(p => p.id !== id)
  }))
);