import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ICartItem } from '../../../shared/models/cart.interface';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [RouterLink, MatButton, MatIcon, CurrencyPipe],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss',
})
export class CartItemComponent {
  item = input.required<ICartItem>();
  constructor(public cartService: CartService) {}

  incrementQuantity() {
    this.cartService.addItemToCart(this.item());
  }
  decrementQuantity() {
    this.cartService.removeItemFromCart(this.item().productId);
  }
  removeItemFromCart() {
    this.cartService.removeItemFromCart(
      this.item().productId,
      this.item().quantity
    );
  }
}
