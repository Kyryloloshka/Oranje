import { Component, OnInit } from '@angular/core';
import { OrderSummaryComponent } from '../../shared/components/order-summary/order-summary.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { StripeService } from '../../core/services/stripe.service';
import { StripeAddressElement } from '@stripe/stripe-js';
import { ToasterService } from '../../core/services/toaster.service';
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [OrderSummaryComponent, MatStepperModule, MatButton, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  private addressElem?: StripeAddressElement;

  constructor(
    private stripeService: StripeService,
    private toaster: ToasterService
  ) {}

  async ngOnInit() {
    try {
      this.addressElem = await this.stripeService.createAddressElem();
      this.addressElem.mount('#address-elem');
    } catch (error: any) {
      this.toaster.error(error.message);
    }
  }
}
