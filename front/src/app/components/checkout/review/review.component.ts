import { Component, Input } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { ConfirmationToken } from '@stripe/stripe-js';
import { AddressPipe } from '../../../shared/pipes/address.pipe';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CurrencyPipe, AddressPipe],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss',
})
export class ReviewComponent {
  @Input() confirmationToken?: ConfirmationToken;
  constructor(protected cartService: CartService) {}

}
