import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';

import * as LayoutComponent from './layout';

import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatStepperModule } from '@angular/material/stepper';

import { HttpService } from './common/services/http.service';
import { AuthService } from './common/services/auth.service';
import { AuthGuardService } from './common/services/auth-guard.service';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent.HeaderComponent,
    LayoutComponent.SidebarComponent,
    LayoutComponent.PostComponent,
    LoginComponent,
    HomeComponent,
    SignupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    TextFieldModule,
    MatStepperModule,
  ],
  providers: [
    AuthService,
    AuthGuardService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    HttpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
