import { Component, OnInit } from '@angular/core';
import { PatientAdvantageModel } from './patient-adavntage.model';
import { patientAdvantageData } from './data';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-patient-advantage',
  standalone: true,
  imports: [],
  templateUrl: './patient-advantage.component.html',
  styleUrl: './patient-advantage.component.scss',
})
export class PatientAdvantageComponent implements OnInit {
  environment = environment;

  advantages!: PatientAdvantageModel[];

  constructor() {}

  ngOnInit(): void {
    this._fetchData();
  }

  private _fetchData() {
    this.advantages = patientAdvantageData;
  }
}
