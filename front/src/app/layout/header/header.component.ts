import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatBadge } from '@angular/material/badge';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { BusyService } from '../../core/services/busy.service';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIcon, MatButton, MatBadge, CommonModule, RouterLink, MatProgressBar],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(public busyService: BusyService) {}

  trackByUrl(_: number, link: any): string {
    return link.url;
  }

  links = [
    {
      name: 'Акції',
      url: '/promotions',
    },
    {
      name: 'Новини',
      url: '/news',
    },
    {
      name: 'Служба підтримки',
      url: '/support',
    },
  ];
}
