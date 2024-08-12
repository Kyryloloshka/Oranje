import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToasterService } from '../services/toaster.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toast = inject(ToasterService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 400:
          if (error.error.errors) {
            const modelStateErrors = [];
            for (const key in error.error.errors) {
              if (error.error.errors[key]) {
                modelStateErrors.push(error.error.errors[key]);
              }
            }
            throw modelStateErrors.flat();
          } else {
            toast.error(error.error.title || error.error);
          }
          break;
        case 401:
          toast.error(error.error.title || error.error);
          break;
        case 404:
          router.navigateByUrl('/not-found');
          break;
        case 500:
          const navigationExtras: NavigationExtras = { state: { error: error.error } };
          router.navigateByUrl('/server-error');
          break;
        default:
          toast.error(error.error.title || error.error);
          break;
      }
      return throwError(() => error);
    })
  );
};
