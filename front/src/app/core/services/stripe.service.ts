import { Injectable } from '@angular/core';
import { loadStripe, Stripe, StripeAddressElement, StripeAddressElementOptions, StripeElements } from '@stripe/stripe-js';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CartService } from './cart.service';
import { Cart } from '../../shared/models/cart.interface';
import { first, firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private stripePromise?: Promise<Stripe | null>;
  baseUrl = environment.apiUrl;
  private elements?: StripeElements;
  private addressElem?: StripeAddressElement;

  constructor(private http: HttpClient, private cartService: CartService) {
    this.stripePromise = loadStripe(environment.stripePublicKey);
  }

  getStripeInstanse() {
    return this.stripePromise;
  }

  createOrUpdatePaymentMethod() {
    const cart = this.cartService.cart();
    if (!cart) throw new Error('Problem with cart');
    return this.http.post<Cart>(this.baseUrl + 'payments/' + cart.id, {}).pipe(
      map((cart) => {
        this.cartService.cart.set(cart);
        return cart;
      })
    );
  }

  async createAddressElem() {
    if (!this.addressElem) {
      const elements = await this.initElements();
      if (elements) {
        const options: StripeAddressElementOptions = {
          mode: 'shipping',
        }
        this.addressElem = elements.create('address', options);
      } else {
        throw new Error('Elements are not loaded');
      }
    }
    return this.addressElem;
  }

  async initElements() {
    if (!this.elements) {
      const stripe = await this.getStripeInstanse();
      if (!stripe) throw new Error('Stripe is not loaded');

      const cart = await firstValueFrom(this.createOrUpdatePaymentMethod());
      this.elements = stripe.elements({
        clientSecret: cart.clientSecret,
        appearance: { labels: 'floating' },
      });
    }
    return this.elements;
  }
}