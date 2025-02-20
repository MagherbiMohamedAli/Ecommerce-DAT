import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsCount = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {
    this.loadCartCount();
  }

  getCart(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${environment.apiUrl}/cart`);
  }

  addToCart(data: { productId: number; quantity: number }): Observable<CartItem> {
    return this.http.post<CartItem>(`${environment.apiUrl}/cart`, data)
      .pipe(tap(() => this.loadCartCount()));
  }

  updateQuantity(productId: number, quantity: number): Observable<CartItem> {
    return this.http.put<CartItem>(`${environment.apiUrl}/cart/product/${productId}`, { quantity })
      .pipe(tap(() => this.loadCartCount()));
  }

  removeFromCart(productId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/cart/product/${productId}`)
      .pipe(tap(() => this.loadCartCount()));
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/cart`)
      .pipe(tap(() => this.cartItemsCount.next(0)));
  }

  getCartCount(): Observable<number> {
    return this.cartItemsCount.asObservable();
  }

  private loadCartCount(): void {
    this.getCart().subscribe(items => {
      const count = items.reduce((sum, item) => sum + item.quantity, 0);
      this.cartItemsCount.next(count);
    });
  }
}