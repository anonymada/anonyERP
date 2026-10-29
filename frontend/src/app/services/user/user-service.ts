import { StorageService } from 'src/app/services/storage/storage.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppConstants } from 'src/app/config/app.constant';

const USER_API = AppConstants.API + 'users';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  username: string;
  userId: number;
  isAdmin = false;
  isModerator = false;
  isUser = true;

  constructor(private http: HttpClient, private storage: StorageService) {
    this.storage.getUsername().then((name) => (this.username = name));
    this.storage.getUserId().then((id) => (this.userId = id));
    this.storage.getRoleAdmin().then((admin) => (this.isAdmin = admin));
    this.storage
      .getRoleModerator()
      .then((moderator) => (this.isModerator = moderator));
  }

  async isLoggedIn(): Promise<boolean> {
    const data = await this.storage.getToken();
    return data ? true : false;
  }

  async logout() {
    await this.storage.clearToken();
    window.location.replace('/login');
  }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error ocured :', error.error.message);
    } else {
      console.error('Backend returned code : ', error.status);
      console.error('Backend returned message : ', error.error.message);
    }
    return throwError(error.error.message);
  }

  list(): Observable<any[]> {
    return this.http.get<any[]>(USER_API).pipe(
      // retry(2),
      catchError(this.handleError)
    );
  }

  public view(id: any): Observable<any> {
    const url = `${USER_API}/details/${id}`;
    return this.http.get<any>(url).pipe(
      // retry(2),
      catchError(this.handleError)
    );
  }

  delete(id: any): Observable<any> {
    const url = `${USER_API}/delete/${id}`;
    return this.http.delete(url).pipe(catchError(this.handleError));
  }

  updateByUser(id: any, data: any): Observable<any> {
    const url = `${USER_API}/update/${id}`;
    return this.http.patch<any>(url, data).pipe(
      // retry(2),
      catchError(this.handleError)
    );
  }

  updateByAdmin(id: any, data: any): Observable<any> {
    const url = `${USER_API}/updaterole/${id}`;
    return this.http.patch<any>(url, data).pipe(
      // retry(2),
      catchError(this.handleError)
    );
  }
}
