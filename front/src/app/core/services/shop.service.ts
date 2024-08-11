import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, OnInit } from '@angular/core';
import { Pagination } from '../../shared/models/pagination.interface';
import { Product } from '../../shared/models/product.interface';
import { ShopParams } from '../../shared/models/shop-params.class';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  baseUrl = 'http://localhost:3000/api/';
  private http = inject(HttpClient);
  types: string[] = [];
  brands: string[] = [];

  getProducts(shopParams: ShopParams) {
    let params = new HttpParams();

    if (shopParams.brands.length) {
      params = params.append('brands', shopParams.brands.join(','));
    }

    if (shopParams.types.length) {
      params = params.append('types', shopParams.types.join(','));
    }

    if (shopParams.sort) {
      params = params.append('sort', shopParams.sort);
    }

    if (shopParams.search) {
      params = params.append('search', shopParams.search);
    }

    params = params.append('pageSize', shopParams.pageSize.toString());
    params = params.append('pageIndex', shopParams.pageIndex.toString());
    return this.http.get<Pagination<Product>>(this.baseUrl + 'products', {
      params,
    });
  }

  getProduct(id: number) {
    return this.http.get<Product>(this.baseUrl + 'products/' + id);
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
