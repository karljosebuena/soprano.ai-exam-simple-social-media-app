import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../common/services/auth.service';
import { SignupService } from './signup.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {

  signUpForm = new FormGroup({});
  uploadedPhoto: Array<any> = new Array();

  constructor(
    private formBuilder: FormBuilder,
    private signUpService: SignupService,
    private authService: AuthService,
    private route: Router,
    private _snackBar: MatSnackBar,
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    document.querySelector('#file')!.addEventListener('change', this.fileUploadEventHandler.bind(this));
  }

  ngOnDestroy(): void {
    document.querySelector('#file')!.removeEventListener('change', this.fileUploadEventHandler.bind(this));
  }

  createForm(): void {
    this.signUpForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [
        Validators.required,
        Validators.pattern(/.+@.+\..+/)
      ]
      ],
      password: ['', Validators.required],
      photo: [null],
    });
  }

  photoChange(e: any) {
    this.uploadedPhoto = e.target.files;
  }

  // TODO: Enhancement for photo upload
  signUp(): void {
    let formData = new FormData();
    for (var i = 0; i < this.uploadedPhoto.length; i++) {
      formData.append("photo", this.uploadedPhoto[i], this.uploadedPhoto[i].name);
    }

    this.signUpForm.controls.photo.setValue(formData);
    this.signUpService.signUp(this.signUpForm.value)
      .subscribe(
        (data: any) => {
          const { userToken, registered } = data;
          if (!userToken && !registered) {
            this._snackBar.open('Registration Failed', 'Duplicate Email', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
            });
            return;
          }

          this._snackBar.open('Registration Completed', 'Success', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
          // this.authService.setToken(userToken);
          // this.authService.setLocalStorageKey('token', userToken);
          this.signUpForm.reset();
          this.route.navigateByUrl('/login');
        },
        err => console.log({ err })
      )
  }

  fileUploadEventHandler(e: any) {
    // Get the selected file
    const [file] = e.target!.files;
    // Get the file name and size
    const { name: fileName, size } = file;
    // Convert size in bytes to kilo bytes
    const fileSize = (size / 1000).toFixed(2);
    // Set the text content
    const fileNameAndSize = `${fileName} - ${fileSize}KB`;
    document.querySelector('.file-name')!.textContent = fileNameAndSize;
  }

}
