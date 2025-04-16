import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
      { path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent) },
      { path: 'forgot-password', loadComponent: () => import('./auth/forget-password/forget-password.component').then(m => m.ForgetPasswordComponent) },
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', loadComponent: () => import('./pages/admin-pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'participants', loadComponent: () => import('./pages/admin-pages/participants/participants.component').then(m => m.ParticipantsComponent) },
      { path: 'trainers', loadComponent: () => import('./pages/admin-pages/trainers/trainers.component').then(m => m.TrainersComponent) },
      { path: 'training-sessions', loadComponent: () => import('./pages/admin-pages/training-session/training-session.component').then(m => m.TrainingSessionComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];