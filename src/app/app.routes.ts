import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/data-generation',
    pathMatch: 'full'
  },
  {
    path: 'data-generation',
    loadComponent: () => import('./components/data-generation/data-generation.component').then(m => m.DataGenerationComponent)
  },
  {
    path: 'data-processing',
    loadComponent: () => import('./components/data-processing/data-processing.component').then(m => m.DataProcessingComponent)
  },
  {
    path: 'database',
    loadComponent: () => import('./components/database/database.component').then(m => m.DatabaseComponent)
  },
  {
    path: 'reports',
    loadComponent: () => import('./components/reports/reports.component').then(m => m.ReportsComponent)
  }
];
