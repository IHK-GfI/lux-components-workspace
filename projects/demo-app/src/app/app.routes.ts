import { Routes } from '@angular/router';

import { DseResolver } from './abstract/dse/dse.resolver';

import { ImpressumResolver } from './abstract/impressum/impressum.resolver';

// prettier-ignore
export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
  { path: 'datenschutz', loadComponent: () => import('./abstract/dse/dse.component').then(m => m.DseComponent), resolve: { content: DseResolver } },
  { path: 'license-hint', loadComponent: () => import('./base/license-hint/license-hint.component').then(m => m.LicenseHintComponent) },
  { path: 'impressum', loadComponent: () => import('./abstract/impressum/impressum.component').then(m => m.ImpressumComponent), resolve: { content: ImpressumResolver } },
  { path: 'components-overview', loadChildren: () => import('./components-overview/components-overview.routes').then((m) => m.COMPONENT_OVERVIEW_ROUTES) },
  { path: 'form', loadChildren: () => import('./form/form-example.routes').then((m) => m.FORM_EXAMPLE_ROUTES) },
  { path: 'configuration', loadComponent: () => import('./configuration/configuration.component').then(m => m.ConfigurationComponent) },
  { path: 'icon-overview', loadComponent: () => import('./components-overview/icon-example/icon-overview/icon-overview.component').then(m => m.IconOverviewComponent) },
  { path: 'baseline', loadComponent: () => import('./baseline/baseline-example.component').then(m => m.BaselineExampleComponent) }
];
