import { Component, OnDestroy, inject } from '@angular/core';
import {
  LuxAutofocusDirective,
  LuxComponentsConfigParameters,
  LuxComponentsConfigService,
  LuxFormHintComponent,
  LuxInputAcComponent,
  LuxLinkComponent,
  LuxSelectAcComponent,
  LuxThemePalette,
  LuxToggleAcComponent
} from 'lux-components-lib';
import { Subscription } from 'rxjs';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { logResult } from '../../example-base/example-base-util/example-base-helper';

@Component({
  selector: 'app-link-example',
  templateUrl: './link-example.component.html',
  imports: [
    LuxLinkComponent,
    LuxToggleAcComponent,
    LuxSelectAcComponent,
    LuxInputAcComponent,
    LuxFormHintComponent,
    LuxAutofocusDirective,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent,
    ExampleBaseAdvancedOptionsComponent
  ]
})
export class LinkExampleComponent implements OnDestroy {
  private configService = inject(LuxComponentsConfigService);

  showOutputEvents = false;
  colors: any[] = [
    { value: '', label: 'default' },
    { value: 'primary', label: 'primary' },
    { value: 'warn', label: 'warn' },
    { value: 'accent', label: 'accent' }
  ];
  config: LuxComponentsConfigParameters;
  log = logResult;
  label = 'LOGIN';
  color: LuxThemePalette = 'primary';
  iconName = 'lux-interface-login-circle';
  iconShowRight = false;
  flat = true;
  raised = false;
  round = false;
  disabled = false;
  blank = true;
  href = 'https://www.ihk-gfi.de/';
  subscription: Subscription;
  modeChangeRunning = false;

  constructor() {
    this.config = this.configService.currentConfig;

    this.subscription = this.configService.config.subscribe((config: LuxComponentsConfigParameters) => {
      if (this.config !== config) {
        this.config = config;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  pickValue(option: any) {
    return option.value;
  }

  updateConfiguration() {
    // Hart das Array leeren, wir triggern die Uppercase Umstellung demo-mäßig einfach für alle entsprechenden Components.
    // Beim Zerstören der Component wird die Konfiguration sowieso wieder resettet (siehe example-base-structure.component.ts).
    this.config.labelConfiguration!.notAppliedTo = [];
    this.configService.updateConfiguration(this.config);
  }

  click(event: Event) {
    this.log(this.showOutputEvents, 'luxClicked', event);
  }

  onFlat(toggle: boolean) {
    if (!this.modeChangeRunning) {
      this.modeChangeRunning = true;
      if (toggle) {
        this.raised = false;
        this.round = false;
      }
      this.modeChangeRunning = false;
    }
  }

  onRaised(toggle: boolean) {
    if (!this.modeChangeRunning) {
      this.modeChangeRunning = true;
      if (toggle) {
        this.flat = false;
        this.round = false;
      }
      this.modeChangeRunning = false;
    }
  }

  onRounded(toggle: boolean) {
    if (!this.modeChangeRunning) {
      this.modeChangeRunning = true;
      if (toggle) {
        this.flat = false;
        this.raised = false;
      }
      this.modeChangeRunning = false;
    }
  }
}
