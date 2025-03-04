import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LuxButtonComponent } from '../../lux-action/lux-button/lux-button.component';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { LuxCardContentComponent } from '../../lux-layout/lux-card/lux-card-subcomponents/lux-card-content.component';
import { LuxCardComponent } from '../../lux-layout/lux-card/lux-card.component';
import { LuxPanelContentComponent } from '../../lux-layout/lux-panel/lux-panel-subcomponents/lux-panel-content.component';
import { LuxPanelHeaderTitleComponent } from '../../lux-layout/lux-panel/lux-panel-subcomponents/lux-panel-header-title.component';
import { LuxPanelComponent } from '../../lux-layout/lux-panel/lux-panel.component';
import { ILuxErrorPageConfig } from './lux-error-interfaces/lux-error-page-config.interface';
import { ILuxError } from './lux-error-interfaces/lux-error.interface';
import { LuxErrorStoreService } from './lux-error-services/lux-error-store.service';

@Component({
  selector: 'lux-error-page',
  templateUrl: './lux-error-page.component.html',
  imports: [
    LuxCardComponent,
    LuxCardContentComponent,
    LuxButtonComponent,
    LuxPanelComponent,
    LuxPanelHeaderTitleComponent,
    LuxPanelContentComponent,
    LuxIconComponent
  ]
})
export class LuxErrorPageComponent {
  private router = inject(Router);
  private errorStore = inject(LuxErrorStoreService);

  get error(): ILuxError | null {
    return this.errorStore.error;
  }

  get errorConfig(): ILuxErrorPageConfig {
    return this.errorStore.config;
  }

  /**
   * Navigiert über den Router zum eingetragenen Home-Pfad
   */
  clickHomeRedirect() {
    this.router.navigate([this.errorConfig.homeRedirectUrl]);
  }
}
