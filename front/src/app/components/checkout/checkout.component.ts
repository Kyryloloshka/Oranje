import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { OrderSummaryComponent } from '../../shared/components/order-summary/order-summary.component';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { StripeService } from '../../core/services/stripe.service';
import {
  ConfirmationToken,
  StripeAddressElement,
  StripeAddressElementChangeEvent,
  StripePaymentElement,
  StripePaymentElementChangeEvent,
} from '@stripe/stripe-js';
import { ToasterService } from '../../core/services/toaster.service';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Address } from '../../shared/models/user.interface';
import { firstValueFrom } from 'rxjs';
import { AccountService } from '../../core/services/account.service';
import { DeliveryComponent } from './delivery/delivery.component';
import { ReviewComponent } from './review/review.component';
import { CartService } from '../../core/services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    OrderSummaryComponent,
    MatStepperModule,
    MatButton,
    RouterLink,
    MatCheckboxModule,
    DeliveryComponent,
    ReviewComponent,
    CurrencyPipe,
		MatProgressSpinnerModule,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit, OnDestroy {
  private addressElem?: StripeAddressElement;
  private paymentElem?: StripePaymentElement;
  protected saveAddress = false;
  protected completionStatus = signal<{
    address: boolean;
    payment: boolean;
    delivery: boolean;
  }>({ address: false, payment: false, delivery: false });
  protected confirmationToken?: ConfirmationToken;
  protected loading = false;

  constructor(
    private stripeService: StripeService,
    private toaster: ToasterService,
    private accountService: AccountService,
    protected cartService: CartService,
		private router: Router,
  ) {}

  async ngOnInit() {
    try {
      this.addressElem = await this.stripeService.createAddressElem();
      this.addressElem.mount('#address-elem');
      this.addressElem.on('change', this.handleAddressChange);

      this.paymentElem = await this.stripeService.createPaymentElem();
      this.paymentElem.mount('#payment-elem');
      this.paymentElem.on('change', this.handlePaymentChange);
    } catch (error: any) {
      this.toaster.error(error.message);
    }
  }

  handleAddressChange = (event: StripeAddressElementChangeEvent) => {
    this.completionStatus.update((state) => {
      state.address = event.complete;
      return state;
    });
  };

  handlePaymentChange = (event: StripePaymentElementChangeEvent) => {
    this.completionStatus.update((state) => {
      state.payment = event.complete;
      return state;
    });
  };

  handleDeliveryChange = (event: boolean) => {
    this.completionStatus.update((state) => {
      state.delivery = event;
      return state;
    });
  };

  onSaveAddressChange(event: MatCheckboxChange) {
    this.saveAddress = event.checked;
  }

  async onStepChange(event: StepperSelectionEvent) {
    if (event.selectedIndex === 1) {
      if (this.saveAddress) {
        const address = await this.getAddressFromStripeAddress();
        address && firstValueFrom(this.accountService.updateAddress(address));
      }
    }
    if (event.selectedIndex === 2) {
      await firstValueFrom(this.stripeService.createOrUpdatePaymentMethod());
    }
    if (event.selectedIndex === 3) {
      await this.getConfirmationToken();
    }
  }

  async getConfirmationToken() {
    try {
      if (Object.values(this.completionStatus()).every((status) => status)) {
        const result = await this.stripeService.createConfirmationToken();
        if (result.error) throw new Error(result.error.message);
        this.confirmationToken = result.confirmationToken;
        console.log(this.confirmationToken);
      }
    } catch (error: any) {
      this.toaster.error(error.message);
    }
  }

  async confirmPayment(stepper: MatStepper) {
    this.loading = true;
    try {
      if (this.confirmationToken) {
        const result = await this.stripeService.confirmPayment(
          this.confirmationToken
        );
        if (result.error) {
          throw new Error(result.error.message);
        } else {
          this.cartService.deleteCart();
          this.cartService.selectedDeliveryMethod.set(null);
          this.router.navigateByUrl('/checkout/success');
        }
      }
    } catch (error: any) {
      this.toaster.error(error.message || 'Something went wrong');
      stepper.previous();
    } finally {
      this.loading = false;
    }
  }

  private async getAddressFromStripeAddress(): Promise<Address | null> {
    const value = await this.addressElem?.getValue();
    const address = value?.value.address;
    if (address) {
      return {
        line1: address.line1,
        line2: address.line2 || undefined,
        city: address.city,
        state: address.state,
        postalCode: address.postal_code,
        country: address.country,
      };
    }
    return null;
  }

  ngOnDestroy(): void {
    this.stripeService.disposeElems();
  }
}
