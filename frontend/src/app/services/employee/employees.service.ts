import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AppConstants } from 'src/app/config/app.constant';
import { Employee } from './employees';

const EMPLOYEE_API = AppConstants.API + 'employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
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

  listEmployee(): Observable<Employee[]> {
    return this.http.get<Employee[]>(EMPLOYEE_API).pipe(
      // retry(2),
      catchError(this.handleError)
    );
  }

  addEmployee(data: any): Observable<Employee> {
    const url = `${EMPLOYEE_API}/add`;
    return this.http.post<Employee>(url, data).pipe(
      // retry(2),
      catchError(this.handleError)
    );
  }

  deleteEmployee(id: any): Observable<any> {
    const url = `${EMPLOYEE_API}/delete/${id}`;
    return this.http.delete(url).pipe(catchError(this.handleError));
  }

  viewEmployee(id: any): Observable<Employee> {
    const url = `${EMPLOYEE_API}/details/${id}`;
    return this.http.get<Employee>(url).pipe(
      // retry(2),
      catchError(this.handleError)
    );
  }

  updateEmployee(id: any, data: any): Observable<Employee> {
    const url = `${EMPLOYEE_API}/update/${id}`;
    return this.http.put<Employee>(url, data).pipe(
      // retry(2),
      catchError(this.handleError)
    );
  }
}
