import { Component, OnInit, ViewChild } from '@angular/core';

import { clientLogoModel } from './review.module';
import { ClientLogo } from './data';
import { NgbCarousel, NgbCarouselModule, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-review',
  imports: [NgbCarouselModule, FormsModule],
  // imports: [CommonModule, SlickCarouselModule, NgbNavModule, NgbCarouselModule],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})

/**
 * Review Component
 */
export class ReviewComponent implements OnInit {
  // showNavigationArrows = false;
  showNavigationIndicators = false;

  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;
  pauseOnFocus = true;

  ClientLogo!: clientLogoModel[];

  @ViewChild('carousel', { static: true }) carousel: NgbCarousel;

  constructor() {}

  ngOnInit(): void {
    /**
     * fetches data
     */
    this._fetchData();
  }

  togglePaused() {
    if (this.paused) {
      this.carousel.cycle();
    } else {
      this.carousel.pause();
    }
    this.paused = !this.paused;
  }

  onSlide(slideEvent: NgbSlideEvent) {
    if (this.unpauseOnArrow && slideEvent.paused && (slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)) {
      this.togglePaused();
    }
    if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {
      this.togglePaused();
    }
  }

  /**
   * User grid data fetches
   */
  private _fetchData() {
    this.ClientLogo = ClientLogo;
  }
}
