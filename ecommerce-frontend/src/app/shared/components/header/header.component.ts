import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  cartItemCount$: Observable<number>;
  isLoggedIn$: Observable<boolean>;
  isAdmin$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {
    this.isLoggedIn$ = this.authService.currentUser$.pipe(
      map(user => !!user)
    );
    this.isAdmin$ = this.authService.currentUser$.pipe(
      map(user => user?.role === 'admin')
    );
    this.cartItemCount$ = this.cartService.getCartCount();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}