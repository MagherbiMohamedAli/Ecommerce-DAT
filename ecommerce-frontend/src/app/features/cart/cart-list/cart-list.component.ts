import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CartItem } from '../../../core/models/cart.model';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.scss']
})
export class CartListComponent implements OnInit {
  cartItems: CartItem[] = [];
  isLoading = false;
  displayedColumns: string[] = ['product', 'price', 'quantity', 'total', 'actions'];
  total = 0;

  constructor(
    private cartService: CartService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;
    this.cartService.getCart().subscribe({
      next: (items) => {
        this.cartItems = items;
        this.calculateTotal();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  updateQuantity(item: CartItem, quantity: number): void {
    if (quantity > 0 && quantity <= item.product.stock) {
      this.cartService.updateQuantity(item.product.id, quantity).subscribe({
        next: () => {
          this.loadCart();
          this.notificationService.showNotification('Cart updated successfully', 'success');
        }
      });
    }
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId).subscribe({
      next: () => {
        this.loadCart();
        this.notificationService.showNotification('Item removed from cart', 'success');
      }
    });
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: () => {
        this.loadCart();
        this.notificationService.showNotification('Cart cleared', 'success');
      }
    });
  }

  checkout(): void {
    this.router.navigate(['/orders/create'], { state: { cartItems: this.cartItems } });
  }

  private calculateTotal(): void {
    this.total = this.cartItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);
  }
}
