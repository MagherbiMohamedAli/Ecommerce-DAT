import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Product } from '../../../core/models/product.model';
import { AppState } from '../../../store/app.state';
import { selectProductById } from '../../../store/selectors/product.selectors';
import { loadProducts } from '../../../store/actions/product.actions';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product$: Observable<Product | undefined>;
  isInWishlist = false;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private notificationService: NotificationService
  ) {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    this.product$ = this.store.select(selectProductById(productId));
  }

  ngOnInit(): void {
    this.store.dispatch(loadProducts({}));
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    this.wishlistService.isInWishlist(productId).subscribe(
      isInWishlist => this.isInWishlist = isInWishlist
    );
  }

  addToCart(productId: number): void {
    this.cartService.addToCart({ productId, quantity: 1 }).subscribe();
  }

  toggleWishlist(productId: number): void {
    if (this.isInWishlist) {
      this.wishlistService.removeFromWishlist(productId).subscribe();
    } else {
      this.wishlistService.addToWishlist({ productId }).subscribe();
    }
    this.isInWishlist = !this.isInWishlist;
  }
}