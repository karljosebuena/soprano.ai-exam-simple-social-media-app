import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

import jwt_decode from 'jwt-decode';

@Injectable()
export class AuthService {

  jwtToken?: string;
  decodedToken?: { [key: string]: string };
  expireToken?: boolean;

  constructor() { }

  setToken(token: string) {
    if (token) {
      this.jwtToken = token;
    } else if (this.expireToken) {
      this.jwtToken = '';
    }
  }

  decodeToken() {
    if (this.jwtToken) {
      this.decodedToken = jwt_decode(this.jwtToken);
    }
  }

  getDecodeToken() {
    return jwt_decode(this.jwtToken || '');
  }

  getExpiryTime() {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken.exp : 0;
  }

  isTokenExpired(): boolean {
    const expiryTime: any = this.getExpiryTime();
    if (expiryTime) {
      return ((1000 * expiryTime) - (new Date()).getTime()) < 5000;
    } else {
      return true;
    }
  }

  setLocalStorageKey(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  getLocalStorageKey(key: string) {
    return localStorage.getItem(key);
  }

  removeLocalStorageKey(key: string) {
    localStorage.removeItem(key);
  }

  // in case page is refresh, check localstage for stored token
  checkSavedTokenInLocalStorage() {
    if (this.isTokenExpired()) {
      const token: any = this.getLocalStorageKey('token');
      this.setToken(token);
    }
  }
}