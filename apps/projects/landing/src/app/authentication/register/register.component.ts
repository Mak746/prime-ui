import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AsyncPipe, CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { parsePhoneNumber } from 'awesome-phonenumber';
import { FormControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
// import { AuthService, NotificationService, ProfessionType, cleanObject } from '../../core';
import { routes } from '../../shared/routes/routes';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs';
import { CountryISO, NgxIntlTelInputModule, SearchCountryField } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, NgxIntlTelInputModule, NgbDropdownModule, NgClass, AsyncPipe, NgFor, ReactiveFormsModule, NgIf, NgxMatIntlTelInputComponent],
})
export class RegisterComponent {
  professionTypes: any[];
  signupForm!: UntypedFormGroup;
  submitted = false;
  error: string;
  isLoading = false;
  returnUrl!: string;
  phone: string;
  private fb = inject(UntypedFormBuilder);
  // private service = inject(AuthService);
  private router = inject(Router);
  // private toastService = inject(NotificationService);
  public CountryISO = CountryISO;
  SearchCountryField = SearchCountryField;
  // Login Form

  successmsg = false;

  // set the current year
  year: number = new Date().getFullYear();

  public routes = routes;
  ngOnInit(): void {
    this.createRegisterForm();
  }
  get f() {
    return this.signupForm.controls;
  }
  createRegisterForm() {
    this.signupForm = this.fb.group({
      username: new FormControl('', [Validators.required, Validators.minLength(5)]),
      phoneOrEmail: ['', []],
      phone: ['', [Validators.required, this.isPhoneValidator]],
      email: ['', []],
    });
  }

  isPhoneValidator(): ValidatorFn {
    return (control): ValidationErrors => {
      const parsedPhone = parsePhoneNumber(control.value);
      const isPhoneNumber = parsedPhone.valid;
      const phone = isPhoneNumber ? parsedPhone.number.e164 : '';

      if (!isPhoneNumber) {
        return { phone: true };
      } else {
        // Update the form control's value outside the validator
        setTimeout(() => {
          if (this.signupForm) {
            this.signupForm.patchValue({ phone }, { emitEvent: false });
          }
        }, 0);
        return null;
      }
    };
  }

  isPhoneOrEmailValidator(): ValidatorFn {
    return (control): ValidationErrors => {
      const parsedPhone = parsePhoneNumber(control.value);
      const validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      const isPhoneNumber = parsedPhone.valid;
      const isEmail = control.value?.match(validEmailRegex);
      const isValidPhoneOrEmail = isPhoneNumber || isEmail;
      const phone = isPhoneNumber ? parsedPhone.number.e164 : '';
      const email = isEmail ? control.value : '';
      if (this.signupForm) {
        this.signupForm.patchValue({ phone, email });
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
    const username = this.f['username'].value;
    const internationalNumber = this.f['phone'].value;
    const phone = internationalNumber?.e164Number;
    const email = this.f['email'].value;
    const phoneOrEmail = this.f['phoneOrEmail'].value;
    if (this.signupForm.invalid) {
      return;
    } else {
      this.isLoading = true;
 
    }
  }
}
