import { Routes } from '@angular/router';
import { UnsavedDataGuard } from './unsaved-data-guard/unsaved-data.guard';

// prettier-ignore
export const FORM_EXAMPLE_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./form-example.component').then(m => m.FormExampleComponent), canDeactivate: [UnsavedDataGuard] }
];
