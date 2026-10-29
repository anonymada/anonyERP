import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { AuthResponse } from './auth-response';
import { AppConstants } from '../../config/app.constant';
import { StorageService } from './../storage/storage.service';

const AUTH_API = AppConstants.API + 'auth/';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private storage: StorageService
  ) {}

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error ocured :', error.error.message);
    } else {
      console.error('Backend returned code : ', error.status);
      console.error('Backend returned message : ', error.error.message);
    }
    return throwError(error.error.message);
  }

  register(user: any): Observable<any> {
    return this.httpClient
      .post(AUTH_API + 'signup', user)
      .pipe(retry(2), catchError(this.handleError));
  }

  login(user: any): Observable<AuthResponse> {
    return this.httpClient.post(AUTH_API + 'signin', user).pipe(
      tap(async (res: any) => {
        if (res) {
          this.storage.saveToken(res.accessToken);
          this.storage.saveUsername(res.username);
          this.storage.saveUserrole(res.roles);
          this.storage.saveId(res.id);
        }
      }),
      catchError(this.handleError)
    );
  }

  async logout() {
    await this.storage.clearToken();
    window.location.replace('/login');
  }
}
