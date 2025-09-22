import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { ScrollspyDirective } from '../../directives/scrollspy.directive';

@Component({
  selector: 'app-wecare-apps-banner',
  standalone: true,
  imports: [NgbScrollSpyModule, ScrollToModule, CommonModule, ScrollspyDirective],
  templateUrl: './wecare-apps-banner.component.html',
  styleUrl: './wecare-apps-banner.component.scss',
})
export class WecareAppsBannerComponent {}
