import { Routes } from '@angular/router';
import { AppLayoutComponent } from './core/layout/app-layout/app-layout';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'projects/MJ/board',
  },
  {
    path: 'projects/:projectKey',
    component: AppLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'board',
      },
      {
        path: 'board',
        loadComponent: () =>
          import('./features/board/board-page').then((m) => m.BoardPageComponent),
      },
      {
        path: 'backlog',
        loadComponent: () =>
          import('./features/backlog/backlog-page').then((m) => m.BacklogPageComponent),
      },
      {
        path: 'list',
        loadComponent: () =>
          import('./features/list/list-page').then((m) => m.ListPageComponent),
      },
      {
        path: 'releases',
        loadComponent: () =>
          import('./features/releases/releases-page').then((m) => m.ReleasesPageComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings-page').then((m) => m.SettingsPageComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'projects/MJ/board',
  },
];
