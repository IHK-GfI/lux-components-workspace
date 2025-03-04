import { Component, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LuxSideNavComponent, LuxThemeService } from 'lux-components-lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  router = inject(Router);

  @ViewChild(LuxSideNavComponent) sideNavComp!: LuxSideNavComponent;

  constructor() {
    const themeService = inject(LuxThemeService);
    themeService.setTheme('authentic');
    themeService.loadTheme();

    this.router.initialNavigation();
  }

  goToLicenseHint() {
    this.sideNavComp.close();
    this.router.navigate(['license-hint']);
  }
}
