import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Product } from '../../../core/models/product.model';
import { ProductService, PaginatedProducts } from '../../../core/services/product.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  isLoading = false;
  totalProducts = 0;
  pageSize = 12;
  pageSizeOptions = [12, 24, 36];
  currentFilters = {
    search: '',
    category: '',
    minPrice: null as number | null,
    maxPrice: null as number | null,
    inStock: null as boolean | null,
    page: 0,
    limit: 12
  };

  constructor(
    private productService: ProductService,
    private wishlistService: WishlistService,
    private cartService: CartService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts({
      ...this.currentFilters,
      page: this.currentFilters.page,
      limit: this.pageSize
    }).subscribe({
      next: (response: PaginatedProducts) => {
        this.products = response.items;
        this.totalProducts = response.total;
        this.isLoading = false;
      },
      error: (error) => {
        this.notificationService.showNotification(
          'Error loading products',
          'error'
        );
        this.isLoading = false;
      }
    });
  }

  onFilterChange(filters: any): void {
    this.currentFilters = {
      ...this.currentFilters,
      ...filters,
      page: 0 // Reset to first page when filters change
    };
    this.loadProducts();
  }

  onPageChange(event: PageEvent): void {
    this.currentFilters.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.currentFilters.limit = event.pageSize;
    this.loadProducts();
  }

  openProductForm(product?: Product): void {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '600px',
      data: product,
      disableClose: true // Prevent closing by clicking outside
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  deleteProduct(product: Product): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Product',
        message: `Are you sure you want to delete ${product.name}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.productService.deleteProduct(product.id).subscribe({
          next: () => {
            this.notificationService.showNotification(
              'Product deleted successfully',
              'success'
            );
            this.loadProducts();
          },
          error: (error) => {
            this.notificationService.showNotification(
              'Error deleting product',
              'error'
            );
            this.isLoading = false;
          }
        });
      }
    });
  }

  addToCart(product: Product): void {
    if (product.stock === 0) {
      this.notificationService.showNotification(
        'Product is out of stock',
        'error'
      );
      return;
    }

    this.cartService.addToCart({ productId: product.id, quantity: 1 }).subscribe({
      next: () => {
        this.notificationService.showNotification(
          'Product added to cart',
          'success'
        );
      },
      error: (error) => {
        this.notificationService.showNotification(
          'Error adding product to cart',
          'error'
        );
      }
    });
  }

  toggleWishlist(product: Product): void {
    this.wishlistService.isInWishlist(product.id).subscribe({
      next: (isInWishlist) => {
        if (isInWishlist) {
          this.removeFromWishlist(product);
        } else {
          this.addToWishlist(product);
        }
      },
      error: (error) => {
        this.notificationService.showNotification(
          'Error checking wishlist status',
          'error'
        );
      }
    });
  }

  private addToWishlist(product: Product): void {
    this.wishlistService.addToWishlist({ productId: product.id }).subscribe({
      next: () => {
        this.notificationService.showNotification(
          'Added to wishlist',
          'success'
        );
      },
      error: (error) => {
        this.notificationService.showNotification(
          'Error adding to wishlist',
          'error'
        );
      }
    });
  }

  private removeFromWishlist(product: Product): void {
    this.wishlistService.removeFromWishlist(product.id).subscribe({
      next: () => {
        this.notificationService.showNotification(
          'Removed from wishlist',
          'success'
        );
      },
      error: (error) => {
        this.notificationService.showNotification(
          'Error removing from wishlist',
          'error'
        );
      }
    });
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}