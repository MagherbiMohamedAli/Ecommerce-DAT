import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WishlistListComponent } from './wishlist-list/wishlist-list.component';
import { WishlistRoutingModule } from './wishlist-routing.module';

@NgModule({
  declarations: [WishlistListComponent],
  imports: [
    CommonModule,
    WishlistRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ]
})
export class WishlistModule { }