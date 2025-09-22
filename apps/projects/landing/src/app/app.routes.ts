import { Routes } from '@angular/router';

export const routes: Routes = [
      {
    path: '',
     loadChildren: () => import('./pages/wecare-landing.routes').then((m) => m.routes),
  },
    {
        path: 'auth',
        loadChildren: () => import('./authentication/authentication.routes').then((m) => m.routes),
      },
];
