import { Injectable } from '@angular/core';
import {
	ConfirmationToken,
  loadStripe,
  Stripe,
  StripeAddressElement,
  StripeAddressElementOptions,
  StripeElements,
  StripePaymentElement,
} from '@stripe/stripe-js';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CartService } from './cart.service';
import { Cart } from '../../shared/models/cart.interface';
import { first, firstValueFrom, map } from 'rxjs';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private stripePromise?: Promise<Stripe | null>;
  baseUrl = environment.apiUrl;
  private elements?: StripeElements;
  private addressElem?: StripeAddressElement;
  private paymentElem?: StripePaymentElement;

  constructor(
    private http: HttpClient,
    private cartService: CartService,
    private accountService: AccountService
  ) {
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
        this.cartService.setCart(cart);
        return cart;
      })
    );
  }

  async createPaymentElem() {
    if (!this.paymentElem) {
      const elements = await this.initElements();
      if (elements) {
        this.paymentElem = elements.create('payment');
      } else {
        throw new Error('Elements are not loaded');
      }
    }
    return this.paymentElem;
  }

  getStripeInstance() {
    return this.stripePromise;
  }

  async confirmPayment(confirmationToken: ConfirmationToken) {
    const stripe = await this.getStripeInstance();
    const elements = await this.initElements();
    const result = await elements.submit();
    if (result.error) throw new Error(result.error.message);

    const clientSecret = this.cartService.cart()?.clientSecret;

    if (stripe && clientSecret) {
      return await stripe.confirmPayment({
        clientSecret: clientSecret,
        confirmParams: {
          confirmation_token: confirmationToken.id,
        },
        redirect: 'if_required',
      });
    } else {
      throw new Error('Unable to load stripe');
    }
  }

  async createConfirmationToken() {
    const stripe = await this.getStripeInstanse();
    const elements = await this.initElements();
    const result = await elements.submit();
    if (result.error) throw new Error(result.error.message);
    if (stripe) {
      return await stripe.createConfirmationToken({ elements });
    }
    throw new Error('Stripe is not loaded');
  }

  async createAddressElem() {
    if (!this.addressElem) {
      const elements = await this.initElements();
      if (elements) {
        const user = this.accountService.currentUser();
        let defaultValues: StripeAddressElementOptions['defaultValues'] = {};

        if (user?.firstName && user?.lastName) {
          defaultValues.name = user.firstName + ' ' + user.lastName;
        }

        if (user?.address) {
          defaultValues.address = {
            line1: user.address.line1,
            line2: user.address.line2,
            city: user.address.city,
            state: user.address.state,
            country: user.address.country,
            postal_code: user.address.postalCode,
          };
        }

        const options: StripeAddressElementOptions = {
          mode: 'shipping',
          defaultValues: defaultValues,
        };
        this.addressElem = elements.create('address', options);
      } else {
        throw new Error('Elements are not loaded');
      }
    }
    return this.addressElem;
  }

  disposeElems() {
    this.elements = undefined;
    this.addressElem = undefined;
    this.paymentElem = undefined;
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
