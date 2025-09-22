import { Component } from '@angular/core';
import { HowItWorks } from './how-it-works.model';
import { howItWorks } from './data';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [],
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.scss',
})
export class HowItWorksComponent {
  howItWorks!: HowItWorks[];

  constructor() {}

  ngOnInit(): void {
    this._fetchData();
  }

  private _fetchData() {
    this.howItWorks = howItWorks;
  }
}
