import { Component, OnInit } from '@angular/core';
import { CheckoutService } from '../../../core/services/checkout.service';
import { MatRadioModule } from '@angular/material/radio';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';
import { DeliveryMethod } from '../../../shared/models/deliveryMethod.interface';

@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [MatRadioModule, CurrencyPipe],
  templateUrl: './delivery.component.html',
  styleUrl: './delivery.component.scss',
})
export class DeliveryComponent implements OnInit {
  constructor(
    protected checkoutService: CheckoutService,
    protected cartService: CartService
  ) {}

  ngOnInit(): void {
    this.checkoutService.getDeliveryMethods().subscribe({
      next: (methods) => {
        if (this.cartService.cart()?.deliveryMethodId) {
          const method = methods.find(
            (m) => m.id === this.cartService.cart()?.deliveryMethodId
          );
          if (method) {
            this.cartService.selectedDeliveryMethod.set(method);
          }
        }
      },
    });
  }

  updateDeliveryMethod(method: DeliveryMethod) {
    this.cartService.selectedDeliveryMethod.set(method);
    const cart = this.cartService.cart();
    if (cart) {
      cart.deliveryMethodId = method.id;
      this.cartService.setCart(cart);
    }
  }
}
