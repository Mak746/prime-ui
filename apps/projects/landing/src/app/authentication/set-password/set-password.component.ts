import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import {  FormBuilder,FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { first } from 'rxjs';

@Component({
  selector: 'app-set-password',
  standalone: true,
  imports: [RouterLink,ReactiveFormsModule,NgIf,NgClass],
  templateUrl: './set-password.component.html',
  styleUrl: './set-password.component.scss'
})
export class SetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  submitted = false;
  error = '';
  success = '';
  uname = '';
  loading = false;
  showPrevPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {

    console.log(this.uname);
  }



  /**
   * On submit form
   */
  onSubmit() {
    this.success = '';
    this.submitted = true;

    // stop here if form is invalid
    if (this.resetForm.invalid) {
      return;
    }
    this.proceedToMyAccount();
  }
  proceedToMyAccount() {
   
  
  }
}
