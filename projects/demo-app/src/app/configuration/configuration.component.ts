import { JsonPipe } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  LuxAppFooterButtonInfo,
  LuxAppFooterButtonService,
  LuxAriaRoleDirective,
  LuxAutofocusDirective,
  LuxCardComponent,
  LuxCardContentComponent,
  LuxCheckboxContainerAcComponent,
  LuxComponentsConfigParameters,
  LuxComponentsConfigService,
  LuxIconComponent,
  LuxInputAcComponent,
  LuxSelectAcComponent,
  LuxToggleAcComponent
} from 'lux-components-lib';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lux-configuration',
  templateUrl: './configuration.component.html',
  imports: [
    LuxIconComponent,
    LuxCheckboxContainerAcComponent,
    LuxCardContentComponent,
    LuxCardComponent,
    LuxAriaRoleDirective,
    LuxToggleAcComponent,
    LuxSelectAcComponent,
    LuxInputAcComponent,
    LuxAutofocusDirective,
    JsonPipe
  ]
})
export class ConfigurationComponent implements OnDestroy {
  componentsConfigService = inject(LuxComponentsConfigService);
  private router = inject(Router);
  private footerService = inject(LuxAppFooterButtonService);

  configSubscription: Subscription;

  notAppliedToOptions: string[] = ['lux-link', 'lux-button', 'lux-menu-item', 'lux-side-nav-item', 'lux-tab', 'lux-step'];
  currentConfig: LuxComponentsConfigParameters;

  constructor() {
    this.currentConfig = this.componentsConfigService.currentConfig;

    this.footerService.pushButtonInfos(
      LuxAppFooterButtonInfo.generateInfo({
        label: 'Dokumentation',
        iconName: 'lux-interface-arrows-expand-5',
        cmd: 'documentation-btn',
        color: 'primary',
        flat: true,
        raised: false,
        alwaysVisible: false,
        onClick: () => {
          window.open('https://github.com/IHK-GfI/lux-components/wiki/config', '_blank');
        }
      }),
      LuxAppFooterButtonInfo.generateInfo({
        label: 'Overview',
        iconName: 'lux-interface-arrows-button-left',
        cmd: 'back-btn',
        color: 'primary',
        flat: true,
        raised: false,
        alwaysVisible: true,
        onClick: () => {
          this.router.navigate(['/']);
        }
      })
    );

    this.configSubscription = this.componentsConfigService.config.subscribe((newConfig: LuxComponentsConfigParameters) => {
      if (this.currentConfig !== newConfig) {
        this.currentConfig = newConfig;
      }
    });
  }

  ngOnDestroy() {
    this.configSubscription.unsubscribe();
    this.footerService.clearButtonInfos();
  }

  updateConfig() {
    this.componentsConfigService.updateConfiguration(this.currentConfig);
  }
}
