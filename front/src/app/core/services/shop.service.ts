import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, OnInit } from '@angular/core';
import { Pagination } from '../../shared/models/pagination.interface';
import { Product } from '../../shared/models/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  baseUrl = 'http://localhost:3000/api/';
  private http = inject(HttpClient);
  types: string[] = [];
  brands: string[] = [];

  getProducts(brands?: string[], types?: string[], sort?: string) {
    let params = new HttpParams();

    if (brands?.length) {
      params = params.append('brands', brands.join(','));
    }

    if (types?.length) {
      params = params.append('types', types.join(','));
    }

    if (sort) {
      params = params.append('sort', sort);
    }

    params = params.append('pageSize', '24');
    return this.http.get<Pagination<Product>>(this.baseUrl + 'products', {
      params,
    });
  }

  getTypes() {
    if (this.types.length > 0) return;
    return this.http.get<string[]>(this.baseUrl + 'products/types').subscribe({
      next: (res) => (this.types = res),
      error: (error) => console.error(error),
    });
  }

  getBrands() {
    if (this.brands.length > 0) return;
    return this.http.get<string[]>(this.baseUrl + 'products/brands').subscribe({
      next: (res) => (this.brands = res),
      error: (error) => console.error(error),
    });
  }
}
