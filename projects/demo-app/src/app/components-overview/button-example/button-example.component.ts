import { NgStyle } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import {
  LuxAutofocusDirective,
  LuxButtonComponent,
  LuxComponentsConfigParameters,
  LuxComponentsConfigService,
  LuxFormHintComponent,
  LuxInputAcComponent,
  LuxProgressModeType,
  LuxSelectAcComponent,
  LuxThemePalette,
  LuxToggleAcComponent,
  LuxCardComponent,
  LuxCardContentComponent,
  LuxCardActionsComponent
} from '@ihk-gfi/lux-components';
import { Subscription } from 'rxjs';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { logResult } from '../../example-base/example-base-util/example-base-helper';

@Component({
  selector: 'app-button-example',
  templateUrl: './button-example.component.html',
  imports: [
    LuxButtonComponent,
    LuxToggleAcComponent,
    LuxSelectAcComponent,
    LuxInputAcComponent,
    LuxFormHintComponent,
    LuxAutofocusDirective,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    NgStyle,
    ExampleBaseSimpleOptionsComponent,
    LuxCardComponent,
    LuxCardContentComponent,
    LuxCardActionsComponent
  ]
})
export class ButtonExampleComponent implements OnDestroy {
  private configService = inject(LuxComponentsConfigService);

  showOutputEvents = false;
  config: LuxComponentsConfigParameters;
  log = logResult;

  colors: any[] = [
    { value: '', label: 'default' },
    { value: 'primary', label: 'primary' },
    { value: 'warn', label: 'warn' },
    { value: 'accent', label: 'accent' }
  ];

  badgeColors: any[] = [
    { value: 'primary', label: 'primary' },
    { value: 'warn', label: 'warn' },
    { value: 'accent', label: 'accent' }
  ];

  label = 'Button';
  iconName = 'lux-interface-delete-1';
  iconShowRight = false;
  disabled = false;
  backgroundColor = '';
  buttonBadge = '';
  buttonBadgeColor: LuxThemePalette = 'primary';
  subscription: Subscription;
  spinnerModes = ['determinate', 'indeterminate'];
  spinnerMode: LuxProgressModeType = 'determinate';
  spinnerValue = 70;
  spinnerExampleLoading = false;
  spinnerExampleFirstname = '';
  spinnerExampleLastname = '';

  get allUpperCase() {
    return this.config.labelConfiguration!.allUppercase;
  }

  set allUpperCase(value: boolean) {
    this.config.labelConfiguration!.allUppercase = value;
    this.updateConfiguration();
  }

  constructor() {
    const configService = this.configService;

    this.config = configService.currentConfig;

    this.subscription = this.configService.config.subscribe((config: LuxComponentsConfigParameters) => {
      this.config = config;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  updateConfiguration() {
    // Hart das Array leeren, wir triggern die Uppercase Umstellung demo-mäßig einfach für alle entsprechenden Components.
    // Beim Zerstören der Component wird die Konfiguration sowieso wieder resettet (siehe example-base-structure.component.ts).
    this.config.labelConfiguration!.notAppliedTo = [];
    this.configService.updateConfiguration(this.config);
  }

  onBadgeColorChanged(badgeColor: { label: string; value: LuxThemePalette }) {
    this.buttonBadgeColor = badgeColor.value;
  }

  addBarProgress() {
    this.spinnerValue = this.spinnerValue + 10 > 100 ? 100 : this.spinnerValue + 10;
  }

  subtractBarProgress() {
    this.spinnerValue = this.spinnerValue - 10 < 0 ? 0 : this.spinnerValue - 10;
  }

  spinnerExampleUpdateLoading(event: Event) {
    this.spinnerExampleLoading = true;
    setTimeout(() => {
      this.spinnerExampleLoading = false;
      this.spinnerExampleFirstname = '';
      this.spinnerExampleLastname = '';
    }, 4000);
    this.log(this.showOutputEvents, 'Button clicked', event);
  }

  spinnerExampleClear(event: Event) {
    this.spinnerExampleFirstname = '';
    this.spinnerExampleLastname = '';
    this.spinnerExampleLoading = false;
    this.log(this.showOutputEvents, 'Button clicked', event);
  }
}
