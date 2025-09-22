import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgIf } from '@angular/common';

@Component({
  selector: 'app-verify-success',
  templateUrl: './verify-success.component.html',
  styleUrls: ['./verify-success.component.scss'],
  standalone:true,
  imports:[NgIf]
})
export class VerifySuccessComponent implements OnInit {
  // set the currenr year
  year: number = new Date().getFullYear();
  constructor(private router: Router,) {}

  ngOnInit(): void {
    document.body.classList.remove('auth-body-bg');
  }
  isLoading = false;

}
