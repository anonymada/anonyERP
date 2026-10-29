import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { StorageService } from '../services/storage/storage.service';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  constructor(private storage: StorageService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const headers = request.headers.delete('skip');

    if (request.headers.has('skip')) {
      return next.handle(request.clone({ headers }));
    }

    return from(this.storage.getToken()).pipe(
      switchMap((token) => {
        const authenticatedHeaders = token
          ? headers.set('Authorization', token)
          : headers;

        return next.handle(request.clone({ headers: authenticatedHeaders }));
      })
    );
  }
}
