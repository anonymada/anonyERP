import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppConstants } from 'src/app/config/app.constant';

const LOG_API = AppConstants.API + 'employeelog';

@Injectable({
  providedIn: 'root',
})
export class EmployeelogService {
  constructor(private http: HttpClient) {}

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error ocured :', error.error.message);
    } else {
      console.error('Backend returned code : ', error.status);
      console.error('Backend returned message : ', error.error.message);
    }
    return throwError(error.error.message);
  }

  add(data: any): Observable<any> {
    const url = `${LOG_API}/add`;
    return this.http.post<any>(url, data).pipe(
      // retry(2),
      catchError(this.handleError)
    );
  }

  list(): Observable<any[]> {
    return this.http.get<any[]>(LOG_API).pipe(
      // retry(2),
      catchError(this.handleError)
    );
  }

  view(data): Observable<any> {
    const url = `${LOG_API}/view`;
    return this.http.post<any>(url, data).pipe(
      // retry(2),
      catchError(this.handleError)
    );
  }

  update(data: any): Observable<any> {
    const url = `${LOG_API}/update`;
    return this.http.post<any>(url, data).pipe(
      // retry(2),
      catchError(this.handleError)
    );
  }
}
