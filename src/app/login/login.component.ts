import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../common/services/auth.service';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl(),
    password: new FormControl()
  });

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.authService.checkSavedTokenInLocalStorage();
    if (this.authService.jwtToken && !this.authService.isTokenExpired()) {
      this.router.navigateByUrl('/home');
    }
  }

  createForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login(): void {
    this.loginService.login(this.loginForm.value)
      .subscribe(
        (data: any) => {
          const {
            _id: id,
            name,
            token,
            message,
          } = data;

          if (!token) {
            this._snackBar.open(message, 'Login Failed', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
            });
            return;
          }

          this.authService.setToken(token);
          this.authService.setLocalStorageKey('token', token);
          this.loginForm.reset();
          this.router.navigateByUrl('/home');
        },
        err => console.log({ err })
      )
  }

}
