import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { UserService } from '../../shared/services/user.service';
import { delay } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  errorMessage = '';
  showPass = 0;
  isSubmitted = false;
  loading = false;
  user = {
    email: '',
    password: ''
  }
  isRemember: Boolean = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private tokenService: TokenService,
    private userService: UserService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
  }

  ngOnInit() {

    document.getElementsByTagName('body')[0].className += ' nb-theme-corporate';
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    if (localStorage.getItem('isRemember') === 'true') {
      this.isRemember = true;
      let loginEmail = localStorage.getItem('loginEmail')
      this.form.patchValue({
        username: loginEmail
      });

    }
  }

  passwordType() {
    return this.showPass;
  }

  showPassword() {
    if (this.showPass == 0) {
      this.showPass = 1;
    }
    else {
      this.showPass = 0;
    }
  }

  get formControls() {
    return this.form.controls;
  }

  onSubmit() {
    //console.log(this.form.value);
    this.loading = true;
    this.isSubmitted = true;
    if (this.form.invalid) {
      //this.getFormValidationErrors();
      return;
    }


    this.errorMessage = '';
    const formData = this.form.value;

    this.authService.login(formData.username, formData.password)
      .subscribe(res => {
        this.tokenService.saveToken(res.token);
        this.userService.saveUserId(res.id);
        this.userService.getUserProfile()
          .subscribe(user => {
            this.userService.checkForAccess(user.groups);
            localStorage.setItem('roles', JSON.stringify(this.userService.roles));
            localStorage.setItem('merchant', user.merchant);
            delay(1000);
            if (this.isRemember) {
              localStorage.setItem('loginEmail', formData.username)
            } else {
              localStorage.setItem('loginEmail', '')
            }
            this.router.navigate(['pages']);
            this.loading = false;
          }, err => {
            this.toastr.error(err.error.message);
            this.loading = false;
          });
      }, err => {
        if (err.status === 0) {
          this.errorMessage = this.translate.instant('COMMON.INTERNAL_SERVER_ERROR');
        } else if (err.status === 403 && err.error && err.error.reason) {
          // Handle password policy enforcement
          const reason = err.error.reason;
          const userId = err.error.userId;

          if (reason === 'WEAK_PASSWORD' || reason === 'LEGACY_USER' || reason === 'PASSWORD_EXPIRED') {
            // Store user ID for password change
            localStorage.setItem('passwordChangeUserId', userId);

            // Show appropriate message
            let message = 'Your password needs to be changed.';
            if (reason === 'WEAK_PASSWORD') {
              message = 'Your password does not meet security requirements. Please change it.';
            } else if (reason === 'PASSWORD_EXPIRED') {
              message = 'Your password has expired. Please change it.';
            }

            this.toastr.warning(message);
            this.loading = false;

            // Redirect to password change page after a short delay
            setTimeout(() => {
              this.router.navigate(['auth/mandatory-password-change']);
            }, 1000);
            return;
          }

          this.errorMessage = this.translate.instant('LOGIN.INVALID_DATA');
        } else {
          this.errorMessage = this.translate.instant('LOGIN.INVALID_DATA');
        }
        this.loading = false;
      });
  }
  onCheckRemember(e) {
    //console.log(e.target.checked)
    this.isRemember = e.target.checked;
    if (e.target.checked) {
      localStorage.setItem('isRemember', 'true')
    } else {
      localStorage.setItem('isRemember', 'false')
    }
  }

  getFormValidationErrors() {
    Object.keys(this.form.controls).forEach(key => {

      const controlErrors: ValidationErrors = this.form.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
    });
  }

  onClickForgotPassword() {
    this.router.navigate(['auth/forgot-password']);
  }

  onClickRegister() {
    this.router.navigate(['auth/register']);
  }

}
