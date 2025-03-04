import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LicenseHintComponent } from './base/license-hint/license-hint.component';
import { ErrorComponent } from './error/error.component';
import { HomeComponent } from './home/home.component';
import { ProfilComponent } from './profil/profil.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'profil', component: ProfilComponent },
  { path: 'license-hint', component: LicenseHintComponent },
  { path: '**', component: ErrorComponent } // Immer als letzte Route !! -> 404!
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
