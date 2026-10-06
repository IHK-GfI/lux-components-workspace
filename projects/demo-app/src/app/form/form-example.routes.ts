import { Routes } from '@angular/router';
import { luxLeaveGuard } from '@ihk-gfi/lux-components/lux-leave-guard';

// prettier-ignore
export const FORM_EXAMPLE_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./form-example.component').then(m => m.FormExampleComponent), canDeactivate: [luxLeaveGuard] }
];
