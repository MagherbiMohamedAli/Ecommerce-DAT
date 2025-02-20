import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WishlistListComponent } from './wishlist-list/wishlist-list.component';
import { AuthGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  { path: '', component: WishlistListComponent, canActivate: [AuthGuard] }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WishlistRoutingModule { }
