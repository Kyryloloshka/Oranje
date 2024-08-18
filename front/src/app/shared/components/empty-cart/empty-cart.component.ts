import { Component, inject, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { BusyService } from '../../../core/services/busy.service';

@Component({
  selector: 'app-empty-cart',
  standalone: true,
  imports: [MatIcon, MatButton, RouterLink],
  templateUrl: './empty-cart.component.html',
  styleUrl: './empty-cart.component.scss',
})
export class EmptyCartComponent {
  busyService = inject(BusyService);
  message = input.required<string>();
  icon = input.required<string>();
  actionText = input.required<string>();
  action = output<void>();

  onAction() {
    this.action.emit();
  }
}
