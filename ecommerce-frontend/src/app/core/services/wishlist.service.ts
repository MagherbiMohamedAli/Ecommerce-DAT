import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WishlistItem } from '../models/wishlist.model';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  constructor(private http: HttpClient) { }

  getWishlist(): Observable<WishlistItem[]> {
    return this.http.get<WishlistItem[]>(`${environment.apiUrl}/wishlist`);
  }

  addToWishlist(data: { productId: number }): Observable<WishlistItem> {
    return this.http.post<WishlistItem>(`${environment.apiUrl}/wishlist`, data);
  }

  removeFromWishlist(productId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/wishlist/product/${productId}`);
  }

  clearWishlist(): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/wishlist`);
  }

  isInWishlist(productId: number): Observable<boolean> {
    return this.http.get<boolean>(`${environment.apiUrl}/wishlist/check/${productId}`);
  }
}