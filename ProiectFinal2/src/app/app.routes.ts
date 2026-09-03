import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then((m) => m.Register),
    canActivate: [guestGuard],
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile').then((m) => m.Profile),
    canActivate: [authGuard],
  },
  {
    path: 'tasks',
    loadComponent: () => import('./pages/tasks/tasks').then((m) => m.Tasks),
    canActivate: [authGuard],
  },
  {
    path: 'tasks/status/:status',
    loadComponent: () =>
      import('./pages/task-status/task-status').then((m) => m.TaskStatus),
    canActivate: [authGuard],
  },
  {
    path: 'statistics',
    loadComponent: () => import('./pages/statistics/statistics').then((m) => m.Statistics),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];
