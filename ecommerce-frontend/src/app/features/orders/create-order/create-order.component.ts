import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartItem } from '../../../core/models/cart.model';
import { OrderService } from '../../../core/services/order.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CartService } from '../../../core/services/cart.service';
import { CreateOrderDto, OrderItem } from '../../../core/models/order.model';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss']
})
export class CreateOrderComponent implements OnInit {
  cartItems: CartItem[] = [];
  total = 0;
  isLoading = false;
  displayedColumns: string[] = ['product', 'price', 'quantity', 'total'];

  constructor(
    private router: Router,
    private orderService: OrderService,
    private cartService: CartService,
    private notificationService: NotificationService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { cartItems: CartItem[] };

    if (state?.cartItems) {
      this.cartItems = state.cartItems;
      this.calculateTotal();
    }
  }

  ngOnInit(): void {
    if (!this.cartItems.length) {
      this.loadCart();
    }
  }

  private loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (items) => {
        this.cartItems = items;
        this.calculateTotal();
      }
    });
  }

  private calculateTotal(): void {
    this.total = this.cartItems.reduce((sum, item) =>
      sum + (item.product.price * item.quantity), 0
    );
  }

  placeOrder(): void {
    if (!this.cartItems.length) {
      this.notificationService.showNotification('Your cart is empty', 'error');
      return;
    }

    this.isLoading = true;
    const orderData: CreateOrderDto = {
      items: this.cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }))
    };

    this.orderService.createOrder(orderData).subscribe({
      next: () => {
        this.notificationService.showNotification(
          'Order placed successfully',
          'success'
        );
        this.router.navigate(['/orders']);
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.showNotification(
          error.error?.message || 'Failed to place order',
          'error'
        );
      }
    });
  }
}