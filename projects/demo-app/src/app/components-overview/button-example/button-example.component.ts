import { NgStyle, NgTemplateOutlet } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import {
  LuxAutofocusDirective,
  LuxButtonComponent,
  LuxCardActionsComponent,
  LuxCardComponent,
  LuxCardContentComponent,
  LuxComponentsConfigParameters,
  LuxComponentsConfigService,
  LuxFormHintComponent,
  LuxInputAcComponent,
  LuxProgressModeType,
  LuxSelectAcComponent,
  LuxTextboxComponent,
  LuxThemePalette,
  LuxToggleAcComponent
} from '@ihk-gfi/lux-components';
import { Subscription } from 'rxjs';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { logResult } from '../../example-base/example-base-util/example-base-helper';

type ErrorBoxType = 'default' | 'gradient' | 'loading';

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
    LuxCardActionsComponent,
    LuxTextboxComponent,
    NgTemplateOutlet
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
  disabledAria = false;
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
  errorBoxDefault = false;
  errorBoxGradient = false;
  errorBoxLoading = false;

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

  onButtonClick(box: ErrorBoxType, aux: boolean, event: Event) {
    this.log(this.showOutputEvents, `${aux ? 'Aux-' : ''}Button clicked`, event);
    this.resetBoxVisibility();
    this.updateBoxVisibility(box, false);
  }

  onClickNotAllowed(box: ErrorBoxType, event: Event) {
    this.log(this.showOutputEvents, 'Click not allowed button clicked', event);
    this.resetBoxVisibility();
    this.updateBoxVisibility(box, true);
  }

  private updateBoxVisibility(box: ErrorBoxType, visible: boolean) {
    switch (box) {
      case 'default':
        this.errorBoxDefault = visible;
        break;
      case 'gradient':
        this.errorBoxGradient = visible;
        break;
      case 'loading':
        this.errorBoxLoading = visible;
        break;
    }
  }

  private resetBoxVisibility() {
    this.errorBoxDefault = false;
    this.errorBoxGradient = false;
    this.errorBoxLoading = false;
  }
}
