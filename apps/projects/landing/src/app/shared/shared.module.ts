import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatSliderModule } from '@angular/material/slider';
import { LightgalleryModule } from 'lightgallery/angular';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { CountUpModule } from 'ngx-countup';
import { LightboxModule } from 'ngx-lightbox';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { FooterComponent } from './landing/footer/footer.component';
import { ReviewComponent } from './landing/review/review.component';
import { ServicesComponent } from './landing/services/services.component';
import { LandingScrollspyDirective } from './directives/landingscrollspy.directive';
import { ScrollspyDirective } from './directives/scrollspy.directive';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

@NgModule({
  declarations: [],
  imports: [
    // directives
    LandingScrollspyDirective,
    ScrollspyDirective,

    // landing
    FooterComponent,
    ReviewComponent,
    ServicesComponent,
    //
    CommonModule,
    HttpClientModule,
    NgApexchartsModule,
    FormsModule,
    ReactiveFormsModule,
    // NgxMaskModule.forRoot({
    //   showMaskTyped: false,
    // }),
    SlickCarouselModule,
    BsDatepickerModule.forRoot(),
    NgCircleProgressModule.forRoot({
      radius: 40,
      space: -5,
      outerStrokeWidth: 5,
      innerStrokeWidth: 5,
      animationDuration: 1000,
      startFromZero: false,
      lazy: false,
      outerStrokeLinecap: 'square',
      showSubtitle: false,
      showTitle: false,
      showUnits: false,
      showBackground: false,
    }),
    CarouselModule,
    TimepickerModule,
    CountUpModule,
    GoogleMapsModule,
    LightboxModule,
    NgxMatIntlTelInputComponent,
    LightgalleryModule,
    NgScrollbarModule,
    MatSliderModule,

    ClipboardModule,
    DragDropModule,
    ScrollingModule,
  ],
  exports: [
    // directives
    LandingScrollspyDirective,
    ScrollspyDirective,

    CommonModule,
    HttpClientModule,
    NgApexchartsModule,
    FormsModule,
    ReactiveFormsModule,
    // NgxMaskModule,
    SlickCarouselModule,
    BsDatepickerModule,
    NgCircleProgressModule,
    CarouselModule,
    TimepickerModule,
    CountUpModule,
    LightboxModule,
    NgxMatIntlTelInputComponent,
    LightgalleryModule,
    NgScrollbarModule,
    MatSliderModule,

    ClipboardModule,
    DragDropModule,
    ScrollingModule,
  ],
  providers: [
    DatePipe,
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class SharedModule {}
