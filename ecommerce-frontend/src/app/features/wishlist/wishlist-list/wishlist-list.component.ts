import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../../core/services/wishlist.service';
import { CartService } from '../../../core/services/cart.service';
import { NotificationService } from '../../../core/services/notification.service';
import { WishlistItem } from '../../../core/models/wishlist.model';

@Component({
  selector: 'app-wishlist-list',
  templateUrl: './wishlist-list.component.html',
  styleUrls: ['./wishlist-list.component.scss']
})
export class WishlistListComponent implements OnInit {
  wishlistItems: WishlistItem[] = [];
  isLoading = false;

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.isLoading = true;
    this.wishlistService.getWishlist().subscribe({
      next: (items) => {
        this.wishlistItems = items;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  removeFromWishlist(productId: number): void {
    this.wishlistService.removeFromWishlist(productId).subscribe({
      next: () => {
        this.loadWishlist();
        this.notificationService.showNotification(
          'Item removed from wishlist',
          'success'
        );
      }
    });
  }

  addToCart(productId: number): void {
    this.cartService.addToCart({ productId, quantity: 1 }).subscribe({
      next: () => {
        this.notificationService.showNotification(
          'Item added to cart',
          'success'
        );
      }
    });
  }

  clearWishlist(): void {
    this.wishlistService.clearWishlist().subscribe({
      next: () => {
        this.loadWishlist();
        this.notificationService.showNotification(
          'Wishlist cleared',
          'success'
        );
      }
    });
  }
}
