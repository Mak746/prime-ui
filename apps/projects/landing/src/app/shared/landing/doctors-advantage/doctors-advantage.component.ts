import { Component } from '@angular/core';
import { DoctorsAdvantageModel } from './doctor-adavntage.model';
import { doctorAdvantagesDate } from './data';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-doctors-advantage',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './doctors-advantage.component.html',
  styleUrl: './doctors-advantage.component.scss',
})
export class DoctorsAdvantageComponent {
  environment = environment;

  advantages!: DoctorsAdvantageModel[];

  constructor() {}

  ngOnInit(): void {
    this._fetchData();
  }

  private _fetchData() {
    this.advantages = doctorAdvantagesDate;
  }
}
