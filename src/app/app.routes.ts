import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { AuthGuard } from './shared/guards/authGuard';
import { ManagerGuard } from './shared/guards/managerGuard';
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
        canActivate: [AuthGuard]
      },
      { 
        path: 'participants', 
        loadComponent: () => import('./pages/admin-pages/participants/participants.component').then(m => m.ParticipantsComponent),
        canActivate: [AdminGuard]
      },
      { 
        path: 'trainers', 
        loadComponent: () => import('./pages/admin-pages/trainers/trainers.component').then(m => m.TrainersComponent),
        canActivate: [AdminGuard]
      },
      { 
        path: 'training-sessions', 
        loadComponent: () => import('./pages/admin-pages/training-session/training-session.component').then(m => m.TrainingSessionComponent),
        canActivate: [AdminGuard]
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];