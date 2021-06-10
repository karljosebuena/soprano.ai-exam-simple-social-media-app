import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  REST_API_SERVER = environment.api;

  constructor(
    protected httpClient: HttpClient,
    protected authService: AuthService
  ) { }

  getHeader(): any {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': this.authService.jwtToken || ''
      })
    }
  }

  errorHandler(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}. Message: ${error.error.message}`;
    }
    return throwError(errorMessage);
  }

  getServerInfo(): Observable<any> {
    return this.httpClient
      .get(this.REST_API_SERVER)
      .pipe(retry(3), catchError(this.errorHandler));
  }
}
