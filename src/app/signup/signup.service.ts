import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, retry } from 'rxjs/operators';

import { HttpService } from '../common/services/http.service';
import { User } from '../common/interfaces/user.interface';
import { Observable } from 'rxjs';
import { AuthService } from '../common/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SignupService extends HttpService {

  constructor(
    httpClient: HttpClient,
    authService: AuthService
  ) {
    super(httpClient, authService);
  }

  signUp(data: User): Observable<any>{
    return this.httpClient
      .post(`${this.REST_API_SERVER}/api/auth/signup`, data)
      .pipe(retry(1), catchError(this.errorHandler));
  }
}
