import { Component } from '@angular/core';
import { ShopService } from '../../core/services/shop.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../shared/models/product.interface';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent {
  constructor(
    private shop: ShopService,
    private activateRoute: ActivatedRoute
  ) {}
  product?: Product;

  ngOnInit() {
    this.loadProduct();
  }

  loadProduct() {
    const id = this.activateRoute.snapshot.paramMap.get('id');
    if (!id) return;
    this.shop.getProduct(+id).subscribe({
      next: (product) => (this.product = product),
      error: (error) => console.error(error),
    });
  }
}
