import { Component, NgModule, OnInit, ViewChild, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbAlert, NgbAlertModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, Subject } from 'rxjs';
import { NgOtpInputModule } from 'ng-otp-input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'],
  standalone:true,
  imports:[NgbAlertModule,NgOtpInputModule,FormsModule,NgbToastModule,ReactiveFormsModule,CommonModule]
})
export class VerifyComponent implements OnInit {

  year: number = new Date().getFullYear();
  message = 'Verify your account Registration';
  verifyForm: FormGroup;
  isLoading = false;
  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      width: '40px',
      height: '40px',
    },
  };
  constructor(private formBuilder: FormBuilder,  private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {



  }
  private createForm() {
    this.verifyForm = this.formBuilder.group({
      phone: ['', [Validators.required]],
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    });
  }
  get phone(): AbstractControl {
    return this.verifyForm.get('phone') as AbstractControl;
  }
  get otp(): AbstractControl {
    return this.verifyForm.get('otp') as AbstractControl;
  }

  onOtpChange(otp) {
    this.otp.patchValue(otp);
  }
  resend() {
    this.changeSuccessMessage();
  }
  goToNext(frm) {

  }
  // alert
  private _success = new Subject<string>();

  successMessage = '';

  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert: NgbAlert;

  public changeSuccessMessage() {

  }
  resendButtonLabel = 'Resend'
  isResendEnabled = true
  disableResendFor(seconds) {
    this.isResendEnabled = false
    let textSec: any = "0";
    let statSec: number = seconds;

    const timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = "0" + statSec;
      } else textSec = statSec;

      this.resendButtonLabel = `Resend Again in ${Math.floor(seconds / 60)}:${textSec}`;
      if (seconds == 0) {
        clearInterval(timer);
        this.resendButtonLabel = 'Resend'
        this.isResendEnabled = true
      }
    }, 1000);
  }
}
