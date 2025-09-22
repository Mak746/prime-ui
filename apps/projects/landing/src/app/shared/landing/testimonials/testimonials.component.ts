import { Component, ViewChild } from '@angular/core';
import { TestimonialModel } from './testimonial.model';
import { testimonials } from './data';
import { FormsModule } from '@angular/forms';
import { NgbCarouselModule, NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [NgbCarouselModule, FormsModule],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss',
})
export class TestimonialsComponent {
  // showNavigationArrows = false;
  showNavigationIndicators = true;

  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;
  pauseOnFocus = true;

  testimonials!: TestimonialModel[];

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
    this.testimonials = testimonials;
  }
}
