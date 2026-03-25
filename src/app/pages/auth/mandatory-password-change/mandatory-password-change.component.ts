import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-mandatory-password-change',
  templateUrl: './mandatory-password-change.component.html',
  styleUrls: ['./mandatory-password-change.component.scss']
})
export class MandatoryPasswordChangeComponent implements OnInit {
  form: FormGroup;
  loading = false;
  passwordType = 0;
  newPasswordType = 0;
  confirmPasswordType = 0;
  errorMessage = '';
  userId: string;
  // Password pattern with stronger requirements
  pwdPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.createForm();
  }

  ngOnInit() {
    // Get userId from localStorage (set by login component)
    this.userId = localStorage.getItem('passwordChangeUserId');

    if (!this.userId) {
      // If no userId, redirect to login
      this.toastr.error('Session expired. Please login again.');
      this.router.navigate(['auth']);
    }
  }

  private createForm() {
    this.form = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.pattern(this.pwdPattern)]],
      confirmNewPassword: ['', [Validators.required]],
    }, { validator: this.checkPasswords });
  }

  get currentPassword(): any {
    return this.form.get('currentPassword');
  }

  get newPassword(): any {
    return this.form.get('newPassword');
  }

  get confirmNewPassword(): any {
    return this.form.get('confirmNewPassword');
  }

  checkPasswords(group: FormGroup) {
    const pass = group.controls.newPassword.value;
    const confirmPass = group.controls.confirmNewPassword.value;
    return pass === confirmPass ? null : { notSame: true };
  }

  showCurrentPassword() {
    this.passwordType = this.passwordType === 0 ? 1 : 0;
  }

  showNewPassword() {
    this.newPasswordType = this.newPasswordType === 0 ? 1 : 0;
  }

  showConfirmPassword() {
    this.confirmPasswordType = this.confirmPasswordType === 0 ? 1 : 0;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.errorMessage = 'Please fill all required fields correctly.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const passwords = {
      password: this.form.value.currentPassword,
      changePassword: this.form.value.newPassword
    };

    this.userService.updatePassword(this.userId, passwords)
      .subscribe(res => {
        this.loading = false;
        this.toastr.success('Password changed successfully! Please login with your new password.');

        // Clear the userId from localStorage
        localStorage.removeItem('passwordChangeUserId');

        // Redirect to login after a short delay
        setTimeout(() => {
          this.router.navigate(['auth']);
        }, 2000);
      }, err => {
        this.loading = false;
        if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Failed to change password. Please check your current password and try again.';
        }
        this.toastr.error(this.errorMessage);
      });
  }

}
