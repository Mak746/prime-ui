import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { routes } from '../../shared/routes/routes';
import {  FormControl, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';

import { first } from 'rxjs';
import { parsePhoneNumber } from 'awesome-phonenumber';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [RouterLink,ReactiveFormsModule,NgClass,NgIf,NgxMatIntlTelInputComponent],
})
export class LoginComponent implements OnInit {
    // Login Form
    loginForm!: UntypedFormGroup;
    submitted = false;
    fieldTextType!: boolean;
    error = '';
    returnUrl!: string;
    isLoading = false;
  
    toast!: false;
  // set the current year
  year: number = new Date().getFullYear();
  inBrowser: boolean;

  public routes = routes;
  public navigation() {
    this.router.navigate(['/']);
  }
  ngOnInit(): void {
    this.createLoginForm();
  }

  private fb = inject(UntypedFormBuilder);
  private route = inject(ActivatedRoute);
  // private authService = inject(AuthService);
  private router = inject(Router);
  // private toastService = inject(NotificationService);
  createLoginForm() {
    this.loginForm = this.fb.group({
      password: new FormControl('', Validators.required),
      phoneOrEmail: ['', [Validators.required, this.isPhoneOrEmailValidator()]],
      identifier: ['', []],
      email: ['', []],
    })
  }
  get f() {
    return this.loginForm.controls;
  }
  isPhoneOrEmailValidator(): ValidatorFn {
    return (control): ValidationErrors => {
      const parsedPhone = parsePhoneNumber(control.value);
      const validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      const isPhoneNumber = parsedPhone.valid;
      const isEmail = control.value?.match(validEmailRegex);
      const isValidPhoneOrEmail = isPhoneNumber || isEmail;
      const identifier = isPhoneNumber ? parsedPhone.number.e164 : '';
      const email = isEmail ? control.value : '';
      if (this.loginForm) {
        this.loginForm.patchValue({ identifier, email });
      }

      if (!isValidPhoneOrEmail) {
        return { phoneOrEmail: true };
      } else {
        return null;
      }
    };
  }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    } else {
      this.isLoading = true;
      const loginReqData = { identifier: this.f['identifier'].value, password: this.f['password'].value };
    
    }
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
