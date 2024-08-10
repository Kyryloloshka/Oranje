import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatBadge } from '@angular/material/badge';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIcon, MatButton, MatBadge, RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  trackByUrl(_: number, link: any): string {
    return link.url;
  }
  links = [
    {
      name: 'Home',
      url: '/',
    },
    {
      name: 'Products',
      url: '/products',
    },
    {
      name: 'Cart',
      url: '/cart',
    },
  ];
}
