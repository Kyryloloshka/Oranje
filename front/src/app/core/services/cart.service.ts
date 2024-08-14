import { computed, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Cart, ICartItem } from '../../shared/models/cart.interface';
import { Product } from '../../shared/models/product.interface';
import { firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  baseUrl = environment.apiUrl;
  cart = signal<Cart | null>(null);
  itemCount = computed(() =>
    this.cart()?.items.reduce((a, b) => a + b.quantity, 0)
  );
  totals = computed(() => {
    const cart = this.cart();
    if (!cart) return null;
    
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    
    const shipping = 0;
    const discount = 0;
    
    return {
      subtotal,
      shipping,
      discount,
      total: subtotal + shipping - discount,
    };
  });
  constructor(private http: HttpClient) {}

  getCart(id: string) {
    return this.http.get<Cart>(this.baseUrl + 'cart?id=' + id).pipe(
      map((cart) => {
        this.cart.set(cart);
        return cart;
      })
    );
  }

  setCart(cart: Cart) {
    return this.http.post<Cart>(this.baseUrl + 'cart', cart).subscribe({
      next: (res) => this.cart.set(res),
      error: (error) => console.error(error),
    });
  }

  addItemToCart(item: ICartItem | Product, quantity = 1) {
    const cart = this.cart() ?? this.createCart();
    if (this.isProduct(item)) {
      item = this.mapProductToCartItem(item);
    }
    cart.items = this.addOrUpdateItem(cart.items, item, quantity);
    this.setCart(cart);
  }

  private addOrUpdateItem(
    items: ICartItem[],
    item: ICartItem,
    quantity: number
  ): ICartItem[] {
    const index = items.findIndex((i) => i.productId === item.productId);
    if (index === -1) {
      item.quantity = quantity;
      items.push(item);
    } else {
      items[index].quantity += quantity;
    }
    return items;
  }

  private mapProductToCartItem(product: Product): ICartItem {
    return {
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: 0,
      pictureUrl: product.pictureUrl,
      brand: product.brand,
      type: product.type,
    };
  }

  private isProduct(item: ICartItem | Product): item is Product {
    return (item as Product).id !== undefined;
  }

  private createCart(): Cart {
    const cart = new Cart();
    localStorage.setItem('cart_id', cart.id);
    return cart;
  }

  deleteCart() {
    this.http.delete(this.baseUrl + 'cart?id=' + this.cart()?.id).subscribe({
      next: () => {
        localStorage.removeItem('cart_id');
        this.cart.set(null);
      },
    });
  }
}
