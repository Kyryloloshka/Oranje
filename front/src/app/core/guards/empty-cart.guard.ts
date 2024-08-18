import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { ToasterService } from '../services/toaster.service';

export const emptyCartGuard: CanActivateFn = (route, state) => {
  const cartService = inject(CartService);
  const router = inject(Router);
  const toast = inject(ToasterService);

  if (!cartService.cart() || cartService.cart()?.items.length === 0) {
    toast.error('Карзина порожня');
    router.navigateByUrl('/cart');
    return false;
  }
  return true;
};
