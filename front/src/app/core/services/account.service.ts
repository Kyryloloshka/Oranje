import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Address, User } from '../../shared/models/user.interface';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = environment.apiUrl;
  currentUser = signal<User | null>(null);
  constructor(private http: HttpClient) {}

  login(values: any) {
    let params = new HttpParams();
    params = params.append('useCookies', true);
    return this.http.post<User>(this.baseUrl + 'login', values, {
      params,
      withCredentials: true,
    });
  }

  register(values: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', values);
  }

  getUserInfo() {
    return this.http
      .get<User>(this.baseUrl + 'account/user-info', { withCredentials: true })
      .pipe(
        map((user) => {
          this.currentUser.set(user);
          return user;
        })
      );
  }

  logout() {
    return this.http
      .post(this.baseUrl + 'account/logout', { withCredentials: true })
      .subscribe({
        next: () => {
          this.currentUser.set(null);
        },
      });
  }

  updateAddress(address: Address) {
    return this.http.put<Address>(this.baseUrl + 'account/address', address);
  }
}