import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DeliveryMethod } from '../../shared/models/deliveryMethod.interface';
import { map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  baseUrl = environment.apiUrl;
  deliveryMethods: DeliveryMethod[] = [];
  constructor(private http: HttpClient) {}

  getDeliveryMethods() {
    if (this.deliveryMethods.length > 0) return of(this.deliveryMethods);
    return this.http
      .get<DeliveryMethod[]>(this.baseUrl + 'payments/delivery-methods')
      .pipe(
        map((dm: DeliveryMethod[]) => {
          this.deliveryMethods = dm.sort((a, b) => b.price - a.price);
          return dm;
        })
      );
  }
}
