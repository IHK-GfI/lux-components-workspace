import { NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  LuxAutofocusDirective,
  LuxButtonComponent,
  LuxCardActionsComponent,
  LuxCardComponent,
  LuxCardContentComponent,
  LuxComponentsConfigParameters,
  LuxComponentsConfigService,
  LuxFormHintComponent,
  LuxInputComponent,
  LuxProgressModeType,
  LuxSelectComponent,
  LuxTextboxComponent,
  LuxThemePalette,
  LuxToggleComponent
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
    LuxToggleComponent,
    LuxSelectComponent,
    LuxInputComponent,
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
  readonly colors: any[] = [
    { value: '', label: 'default' },
    { value: 'primary', label: 'primary' },
    { value: 'warn', label: 'warn' },
    { value: 'accent', label: 'accent' }
  ];
  readonly badgeColors: any[] = [
    { value: 'primary', label: 'primary' },
    { value: 'warn', label: 'warn' },
    { value: 'accent', label: 'accent' }
  ];
  readonly spinnerModes = ['determinate', 'indeterminate'];
  readonly markerTypeUpdated = DemoMarkerType.Updated;
  readonly log = logResult;

  readonly config: Signal<LuxComponentsConfigParameters>;

  readonly showOutputEvents = signal(false);
  readonly label = signal('Button');
  readonly iconName = signal('lux-interface-delete-1');
  readonly iconShowRight = signal(false);
  readonly disabled = signal(false);
  readonly disabledAria = signal(false);
  readonly backgroundColor = signal('');
  readonly buttonBadge = signal('');
  readonly buttonBadgeColor = signal<LuxThemePalette>('primary');
  readonly spinnerMode = signal<LuxProgressModeType>('determinate');
  readonly spinnerValue = signal(70);
  readonly spinnerExampleLoading = signal(false);
  readonly spinnerExampleFirstname = signal('');
  readonly spinnerExampleLastname = signal('');
  readonly errorBoxDefault = signal(false);
  readonly errorBoxGradient = signal(false);
  readonly errorBoxLoading = signal(false);

  private readonly configService = inject(LuxComponentsConfigService);

  constructor() {
    this.config = toSignal(this.configService.config, { initialValue: this.configService.currentConfig });
  }

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
    this.buttonBadgeColor.set(badgeColor.value);
  }

  addBarProgress() {
    this.spinnerValue.update((value) => (value + 10 > 100 ? 100 : value + 10));
  }

  subtractBarProgress() {
    this.spinnerValue.update((value) => (value - 10 < 0 ? 0 : value - 10));
  }

  spinnerExampleUpdateLoading(event: Event) {
    this.spinnerExampleLoading.set(true);
    setTimeout(() => {
      this.spinnerExampleLoading.set(false);
      this.spinnerExampleFirstname.set('');
      this.spinnerExampleLastname.set('');
    }, 4000);
    this.log(this.showOutputEvents(), 'Button clicked', event);
  }

  spinnerExampleClear(event: Event) {
    this.spinnerExampleFirstname.set('');
    this.spinnerExampleLastname.set('');
    this.spinnerExampleLoading.set(false);
    this.log(this.showOutputEvents(), 'Button clicked', event);
  }

  onButtonClick(box: ErrorBoxType, aux: boolean, event: Event) {
    this.log(this.showOutputEvents(), `${aux ? 'Aux-' : ''}Button clicked`, event);
    this.resetBoxVisibility();
    this.updateBoxVisibility(box, false);
  }

  onClickNotAllowed(box: ErrorBoxType, event: Event) {
    this.log(this.showOutputEvents(), 'Click not allowed button clicked', event);
    this.resetBoxVisibility();
    this.updateBoxVisibility(box, true);
  }

  private updateBoxVisibility(box: ErrorBoxType, visible: boolean) {
    switch (box) {
      case 'default':
        this.errorBoxDefault.set(visible);
        break;
      case 'gradient':
        this.errorBoxGradient.set(visible);
        break;
      case 'loading':
        this.errorBoxLoading.set(visible);
        break;
    }
  }

  private resetBoxVisibility() {
    this.errorBoxDefault.set(false);
    this.errorBoxGradient.set(false);
    this.errorBoxLoading.set(false);
  }
}
