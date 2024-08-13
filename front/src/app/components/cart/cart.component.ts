import { Component, inject } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { Router } from '@angular/router';
import { CartItemComponent } from './cart-item/cart-item.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CartItemComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  private router = inject(Router)
  cartService = inject(CartService);
  
  onAction() {
    this.router.navigateByUrl('/shop');
  }

}