import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { AuthService } from '../services/auth/auth.service';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage/storage.service';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  token: any;
  constructor(public auth: AuthService, private storage: StorageService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.headers.get('skip')) {
      request = request.clone({
        headers: request.headers.delete('skip'),
      });
      return next.handle(request);
    } else {
      this.storage.getToken().then(async (data) => (this.token = data));
      request = request.clone({
        setHeaders: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Authorization: `${this.token}`,
        },
        headers: request.headers.delete('skip'),
      });
      return next.handle(request);
    }
  }
}
