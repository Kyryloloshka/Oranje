import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Address, User } from '../../shared/models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = environment.apiUrl + 'account/';
  currentUser = signal<User | null>(null);
  constructor(private http: HttpClient) {}

  login(values: any) {
    let params = new HttpParams();
    params = params.append('useCookies', true);
    return this.http.post<User>(this.baseUrl + 'login', values, { params });
  }

  register(values: any) {
    return this.http.post<User>(this.baseUrl + 'register', values);
  }

  getUserInfo() {
    return this.http.get<User>(this.baseUrl + 'user-info').subscribe({
      next: (user) => {
        this.currentUser.set(user);
      },
    });
  }

  logout() {
    return this.http.post(this.baseUrl + 'logout', {}).subscribe({
      next: () => {
        this.currentUser.set(null);
      },
    });
  }

  updateAddress(address: Address) {
    return this.http.put<Address>(this.baseUrl + 'address', address);
  }
}
