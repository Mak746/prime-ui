import { Routes } from '@angular/router';
import { WecareLandingComponent } from './wecare-landing.component';


export const routes: Routes = [
  {
    path: '',
    component: WecareLandingComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),
      }
    ],
  },
  // {
  //   path: '',
  //   loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),
  // },
  // {
  //   path: 'doctors',
  //   loadComponent: () => import('./doctors/doctors.component').then((m) => m.DoctorsComponent),
  // },
];
