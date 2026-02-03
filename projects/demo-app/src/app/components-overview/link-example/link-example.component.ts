import { Component, OnDestroy, inject } from '@angular/core';
import {
  LuxAutofocusDirective,
  LuxComponentsConfigParameters,
  LuxComponentsConfigService,
  LuxFormHintComponent,
  LuxInputAcComponent,
  LuxLinkComponent,
  LuxToggleAcComponent
} from '@ihk-gfi/lux-components';
import { Subscription } from 'rxjs';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { logResult } from '../../example-base/example-base-util/example-base-helper';

@Component({
  selector: 'app-link-example',
  templateUrl: './link-example.component.html',
  imports: [
    LuxLinkComponent,
    LuxToggleAcComponent,
    LuxInputAcComponent,
    LuxFormHintComponent,
    LuxAutofocusDirective,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent
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
  label = 'Login';
  iconName = 'lux-interface-login-circle';
  iconShowRight = false;
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
}
