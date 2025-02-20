import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { CreateOrderComponent } from './create-order/create-order.component';

const routes: Routes = [
  { path: '', component: OrderHistoryComponent, canActivate: [AuthGuard] },
  { path: 'create', component: CreateOrderComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
