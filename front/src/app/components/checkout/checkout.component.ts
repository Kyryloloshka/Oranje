import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrderSummaryComponent } from '../../shared/components/order-summary/order-summary.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { StripeService } from '../../core/services/stripe.service';
import { StripeAddressElement } from '@stripe/stripe-js';
import { ToasterService } from '../../core/services/toaster.service';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Address } from '../../shared/models/user.interface';
import { firstValueFrom } from 'rxjs';
import { AccountService } from '../../core/services/account.service';
import { DeliveryComponent } from "./delivery/delivery.component";
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    OrderSummaryComponent,
    MatStepperModule,
    MatButton,
    RouterLink,
    MatCheckboxModule,
    DeliveryComponent
],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit, OnDestroy {
  private addressElem?: StripeAddressElement;
  protected saveAddress = false;

  constructor(
    private stripeService: StripeService,
    private toaster: ToasterService,
    private accountService: AccountService
  ) {}

  async ngOnInit() {
    try {
      this.addressElem = await this.stripeService.createAddressElem();
      this.addressElem.mount('#address-elem');
    } catch (error: any) {
      this.toaster.error(error.message);
    }
  }

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
