import { Routes } from '@angular/router';
import { ShopComponent } from './components/shop/shop.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';

export const routes: Routes = [
  { path: '', component: ShopComponent },
  { path: 'product/:id', component: ProductDetailsComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
