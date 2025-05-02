import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { AuthGuard } from './shared/guards/authGuard';
import { AdminGuard } from './shared/guards/adminGuard';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
      { path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent) },
      { path: 'forgot-password', loadComponent: () => import('./auth/forget-password/forget-password.component').then(m => m.ForgetPasswordComponent) },
      { path: 'reset-password', loadComponent: () => import('./auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent) },
      { path: 'access-denied', loadComponent: () => import('./pages/unauthorized/access-denied/access-denied.component').then(m => m.AccessDeniedComponent) },

    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard], 
    children: [
      { 
        path: 'dashboard', 
        loadComponent: () => import('./pages/admin-pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
        data: { roles: ['ADMIN', 'MANAGER', 'SIMPLE'] } 
      },
      { 
        path: 'participants', 
        loadComponent: () => import('./pages/admin-pages/participants/participants.component').then(m => m.ParticipantsComponent),
        data: { roles: ['ADMIN', 'SIMPLE'] }
      },
      { 
        path: 'trainers', 
        loadComponent: () => import('./pages/admin-pages/trainers/trainers.component').then(m => m.TrainersComponent),
        data: { roles: ['ADMIN', 'SIMPLE'] }
      },
      { 
        path: 'training-sessions', 
        loadComponent: () => import('./pages/admin-pages/training-session/training-session.component').then(m => m.TrainingSessionComponent),
        data: { roles: ['ADMIN', 'SIMPLE'] }
      },{ 
        path: 'enrollment', 
        loadComponent: () => import('./pages/admin-pages/enrollment/enrollment.component').then(m => m.EnrollmentComponent),
        data: { roles: ['ADMIN'] } 
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];