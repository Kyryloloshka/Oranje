import { Component } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { Router } from '@angular/router';
import { CartItemComponent } from './cart-item/cart-item.component';
import { OrderSummaryComponent } from '../../shared/components/order-summary/order-summary.component';
import { EmptyCartComponent } from '../../shared/components/empty-cart/empty-cart.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CartItemComponent, OrderSummaryComponent, EmptyCartComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  constructor(private router: Router, protected cartService: CartService) {}

  onAction() {
    this.router.navigateByUrl('/');
  }
}
