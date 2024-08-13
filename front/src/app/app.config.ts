import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { InitService } from './core/services/init.service';
import { lastValueFrom } from 'rxjs';

const initializeApp = (initService: InitService) => {
  return () =>
    lastValueFrom(initService.init()).finally(() => {
      const splash = document.getElementById('initial-splash');
      splash?.remove();
    });
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideHttpClient(withInterceptors([errorInterceptor, loadingInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true,
      deps: [InitService],
    },
  ],
};
