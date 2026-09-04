import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import {
  LuxAppFooterButtonInfo,
  LuxAppFooterButtonService,
  LuxAutofocusDirective,
  LuxCardComponent,
  LuxCardContentComponent,
  LuxCheckboxContainerAcComponent,
  LuxComponentsConfigService,
  LuxIconComponent,
  LuxInputAcComponent,
  LuxSelectAcComponent,
  LuxToggleAcComponent
} from '@ihk-gfi/lux-components';

@Component({
  selector: 'lux-configuration',
  templateUrl: './configuration.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxIconComponent,
    LuxCheckboxContainerAcComponent,
    LuxCardContentComponent,
    LuxCardComponent,
    LuxToggleAcComponent,
    LuxSelectAcComponent,
    LuxInputAcComponent,
    LuxAutofocusDirective,
    JsonPipe
  ]
})
export class ConfigurationComponent {
  readonly componentsConfigService = inject(LuxComponentsConfigService);

  readonly currentConfig = toSignal(this.componentsConfigService.config, {
    initialValue: this.componentsConfigService.currentConfig
  });

  readonly notAppliedToOptions = ['lux-link', 'lux-button', 'lux-menu-item', 'lux-side-nav-item', 'lux-tab', 'lux-step'];

  private readonly router = inject(Router);
  private readonly footerService = inject(LuxAppFooterButtonService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
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

    this.destroyRef.onDestroy(() => this.footerService.clearButtonInfos());
  }

  updateConfig() {
    this.componentsConfigService.updateConfiguration(this.currentConfig());
  }
}
