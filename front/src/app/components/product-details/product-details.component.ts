import { Component } from '@angular/core';
import { ShopService } from '../../core/services/shop.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../shared/models/product.interface';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CurrencyPipe,
    MatButton,
    MatIcon,
    MatFormField,
    MatInput,
    MatLabel,
    MatDivider,
    FormsModule,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent {
  constructor(
    private shop: ShopService,
    private activateRoute: ActivatedRoute,
    private cartService: CartService
  ) {}
  product?: Product;
  quantityInCart = 0;
  quantity = 1;

  ngOnInit() {
    this.loadProduct();
  }

  loadProduct() {
    const id = this.activateRoute.snapshot.paramMap.get('id');
    if (!id) return;
    this.shop.getProduct(+id).subscribe({
      next: (product) => {
        this.product = product;
        this.updateQuantity();
      },
      error: (error) => console.error(error),
    });
  }

  updateCart() {
    if (!this.product) return;
    if (this.quantity > this.quantityInCart) {
      const itemsToAdd = this.quantity - this.quantityInCart;
      this.quantityInCart = this.quantity;
      this.cartService.addItemToCart(this.product, itemsToAdd);
    } else {
      const itemsToRemove = this.quantityInCart - this.quantity;
      this.quantityInCart = this.quantity;
      this.cartService.removeItemFromCart(this.product.id, itemsToRemove);
    }
  }

  updateQuantity() {
    this.quantityInCart =
      this.cartService
        .cart()
        ?.items.find((i) => i.productId === this.product?.id)?.quantity || 0;
    this.quantity = this.quantityInCart || 1;
  }

  getButtonLabel() {
    return this.quantityInCart > 0 && this.quantity === 0
      ? 'Видалити з кошика'
      : this.quantityInCart > 0
      ? 'Оновити кошик'
      : 'Додати в кошик';
  }
}
