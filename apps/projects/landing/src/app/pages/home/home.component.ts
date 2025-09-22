import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbCarouselModule, NgbTooltipModule, NgbCollapseModule, NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';

import { ScrollToModule, ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LandingScrollspyDirective } from '../../shared/directives/landingscrollspy.directive';
import { ScrollspyDirective } from '../../shared/directives/scrollspy.directive';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { HowItWorksComponent } from '../../shared/landing/how-it-works/how-it-works.component';
import { PatientAdvantageComponent } from '../../shared/landing/patient-advantage/patient-advantage.component';
import { DoctorsAdvantageComponent } from '../../shared/landing/doctors-advantage/doctors-advantage.component';

import { WecareAppsBannerComponent } from '../../shared/landing/wecare-apps-banner/wecare-apps-banner.component';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgbScrollSpyModule,
    ScrollToModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbCarouselModule,
    SlickCarouselModule,
    CarouselModule,
    NgbTooltipModule,
    NgbCollapseModule,
    SharedModule,
    LandingScrollspyDirective,
    ScrollspyDirective,

    HowItWorksComponent,
    PatientAdvantageComponent,
    DoctorsAdvantageComponent,

    WecareAppsBannerComponent,
 
    RouterModule,
  ],
  providers: [ScrollToService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  environment = environment;

  currentSection = 'home';
  showNavigationArrows: any;
  showNavigationIndicators: any;

  constructor() {}

  ngOnInit(): void {}

  /**
   * Window scroll method
   */
  // tslint:disable-next-line: typedef
  windowScroll() {
    const navbar = document.getElementById('navbar');
    if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
      navbar?.classList.add('is-sticky');
    } else {
      navbar?.classList.remove('is-sticky');
    }

    // Top Btn Set
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
      (document.getElementById('back-to-top') as HTMLElement).style.display = 'block';
    } else {
      (document.getElementById('back-to-top') as HTMLElement).style.display = 'none';
    }
  }

  /**
   * Section changed method
   * @param sectionId specify the current sectionID
   */
  onSectionChange(sectionId: string) {
    this.currentSection = sectionId;
  }

  /**
   * Toggle navbar
   */
  toggleMenu() {
    document.getElementById('navbarSupportedContent')?.classList.toggle('show');
  }

  // When the user clicks on the button, scroll to the top of the document
  topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
}
