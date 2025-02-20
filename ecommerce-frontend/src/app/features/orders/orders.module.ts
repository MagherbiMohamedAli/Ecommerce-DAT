import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { OrdersRoutingModule } from './orders-routing.module';
import { CreateOrderComponent } from './create-order/create-order.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [OrderHistoryComponent, CreateOrderComponent],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatChipsModule,
    SharedModule,

  ]
})
export class OrdersModule { }