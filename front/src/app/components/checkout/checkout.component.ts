import { Component } from '@angular/core';
import { OrderSummaryComponent } from "../../shared/components/order-summary/order-summary.component";
import { MatStepperModule } from '@angular/material/stepper';
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [OrderSummaryComponent, MatStepperModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {

}
