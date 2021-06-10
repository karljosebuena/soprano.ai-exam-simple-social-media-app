import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { User } from '../common/interfaces/user.interface';
import { AuthService } from '../common/services/auth.service';
import { HttpService } from '../common/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends HttpService {

  constructor(
    httpClient: HttpClient,
    authService: AuthService
  ) {
    super(httpClient, authService);
  }

  login(user: User): Observable<any> {
    return this.httpClient
      .post(`${this.REST_API_SERVER}/api/auth/login`, user)
      .pipe(retry(3), catchError(this.errorHandler));
  }
}
