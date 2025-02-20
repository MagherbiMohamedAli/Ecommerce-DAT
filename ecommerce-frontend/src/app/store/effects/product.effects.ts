import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { ProductService } from '../../core/services/product.service';
import { NotificationService } from '../../core/services/notification.service';
import * as ProductActions from '../actions/product.actions';

@Injectable()
export class ProductEffects {
  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProducts),
      mergeMap(({ filters }) =>
        this.productService.getProducts(filters || {}).pipe(
          map(paginatedProducts => ProductActions.loadProductsSuccess({ paginatedProducts })),
          catchError(error =>
            of(ProductActions.loadProductsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  createProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.createProduct),
      mergeMap(({ product }) =>
        this.productService.createProduct(product).pipe(
          map(createdProduct =>
            ProductActions.createProductSuccess({ product: createdProduct })
          ),
          tap(() => {
            this.notificationService.showNotification(
              'Product created successfully',
              'success'
            );
          }),
          catchError(error =>
            of(ProductActions.createProductFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.updateProduct),
      mergeMap(({ id, product }) =>
        this.productService.updateProduct(id, product).pipe(
          map(updatedProduct =>
            ProductActions.updateProductSuccess({ product: updatedProduct })
          ),
          tap(() => {
            this.notificationService.showNotification(
              'Product updated successfully',
              'success'
            );
          }),
          catchError(error =>
            of(ProductActions.updateProductFailure({ error: error.message }))
          )
        )
      )
    )
  );

  deleteProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.deleteProduct),
      mergeMap(({ id }) =>
        this.productService.deleteProduct(id).pipe(
          map(() => ProductActions.deleteProductSuccess({ id })),
          tap(() => {
            this.notificationService.showNotification(
              'Product deleted successfully',
              'success'
            );
          }),
          catchError(error =>
            of(ProductActions.deleteProductFailure({ error: error.message }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private productService: ProductService,
    private notificationService: NotificationService
  ) { }
}