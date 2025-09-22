import { Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication.component';



export const routes: Routes = [
  {
    path: '',
    component: AuthenticationComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent),
        // canMatch: [noAuthGuard],
      },
      {
        path: 'register',
        loadChildren: () => import('./register/register.routes').then((m) => m.routes),
        // canMatch: [noAuthGuard],

      },
      {
        path: 'mobile-otp/:id',
        loadChildren: () =>
          import('./mobile-otp/mobile-otp.routes').then(
            (m) => m.mobileOtpRoutes
          ),                
        
          // canMatch: [noAuthGuard],

      },
      {
        path: 'verify',
        loadComponent: () =>
          import('./verify/verify.component').then(
            (m) => m.VerifyComponent
          ),                
        
          // canMatch: [noAuthGuard],

      },
      {
        path: 'verify-success',
        loadComponent: () =>
          import('./verify-success/verify-success.component').then(
            (m) => m.VerifySuccessComponent
          ),                
        
          // canMatch: [noAuthGuard],

      },
      {
        path: 'set-password',
        loadComponent: () =>
          import('./set-password/set-password.component').then(
            (m) => m.SetPasswordComponent
          ),
        // canMatch: [noAuthGuard],

      }
    ],
  },
];
