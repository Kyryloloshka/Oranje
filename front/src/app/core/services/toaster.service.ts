import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  constructor(private toast: MatSnackBar) { }

  error(message: string) {
    this.toast.open(message, 'Close', {
      duration: 5000,
      panelClass: ['toast-error'],
    });
  }

  success(message: string) {
    this.toast.open(message, 'Close', {
      duration: 5000,
      panelClass: ['toast-success'],
    });
  }
}
