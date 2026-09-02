import { NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  LuxAutofocusDirective,
  LuxButtonComponent,
  LuxCardActionsComponent,
  LuxCardComponent,
  LuxCardContentComponent,
  LuxComponentsConfigService,
  LuxFormHintComponent,
  LuxInputAcComponent,
  LuxProgressModeType,
  LuxSelectAcComponent,
  LuxTextboxComponent,
  LuxThemePalette,
  LuxToggleAcComponent
} from '@ihk-gfi/lux-components';
import { StatusMarkerComponent } from '../../base/status-marker/status-marker.component';
import { DemoMarkerType } from '../../base/status-marker/status-marker.model';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { logResult } from '../../example-base/example-base-util/example-base-helper';

type ErrorBoxType = 'default' | 'gradient' | 'loading';

@Component({
  selector: 'app-button-example',
  templateUrl: './button-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    NgTemplateOutlet,
    StatusMarkerComponent
  ]
})
export class ButtonExampleComponent {
  private configService = inject(LuxComponentsConfigService);
  readonly config = toSignal(this.configService.config, { initialValue: this.configService.currentConfig });

  showOutputEvents = false;
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
  spinnerModes = ['determinate', 'indeterminate'];
  spinnerMode: LuxProgressModeType = 'determinate';
  readonly markerTypeUpdated = DemoMarkerType.Updated;
  spinnerValue = 70;
  readonly spinnerExampleLoading = signal(false);
  readonly spinnerExampleFirstname = signal('');
  readonly spinnerExampleLastname = signal('');
  errorBoxDefault = false;
  errorBoxGradient = false;
  errorBoxLoading = false;

  get allUpperCase() {
    return this.config().labelConfiguration!.allUppercase;
  }

  set allUpperCase(value: boolean) {
    this.config().labelConfiguration!.allUppercase = value;
    this.updateConfiguration();
  }

  updateConfiguration() {
    // Hart das Array leeren, wir triggern die Uppercase Umstellung demo-mäßig einfach für alle entsprechenden Components.
    // Beim Zerstören der Component wird die Konfiguration sowieso wieder resettet (siehe example-base-structure.component.ts).
    const config = this.config();
    config.labelConfiguration!.notAppliedTo = [];
    this.configService.updateConfiguration(config);
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
    this.spinnerExampleLoading.set(true);
    setTimeout(() => {
      this.spinnerExampleLoading.set(false);
      this.spinnerExampleFirstname.set('');
      this.spinnerExampleLastname.set('');
    }, 4000);
    this.log(this.showOutputEvents, 'Button clicked', event);
  }

  spinnerExampleClear(event: Event) {
    this.spinnerExampleFirstname.set('');
    this.spinnerExampleLastname.set('');
    this.spinnerExampleLoading.set(false);
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
