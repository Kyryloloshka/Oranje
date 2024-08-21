import { Component, OnInit } from '@angular/core';
import { CheckoutService } from '../../../core/services/checkout.service';

@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [],
  templateUrl: './delivery.component.html',
  styleUrl: './delivery.component.scss'
})
export class DeliveryComponent implements OnInit {
  constructor(
    protected checkoutService: CheckoutService,

  ) {}

  ngOnInit(): void {
    this.checkoutService.getDeliveryMethods().subscribe();
  }
}
