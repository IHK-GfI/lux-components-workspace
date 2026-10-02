import { Component, OnDestroy, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import {
  LuxComponentsConfigParameters,
  LuxComponentsConfigService,
  LuxFormHintComponent,
  LuxInputComponent,
  LuxLinkPlainComponent,
  LuxToggleComponent
} from '@ihk-gfi/lux-components';
import { Subscription } from 'rxjs';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { logResult } from '../../example-base/example-base-util/example-base-helper';

@Component({
  selector: 'app-link-plain-example',
  templateUrl: './link-plain-example.component.html',
  styleUrls: ['./link-plain-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxLinkPlainComponent,
    LuxToggleComponent,
    LuxInputComponent,
    LuxFormHintComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent
  ]
})
export class LinkPlainExampleComponent implements OnDestroy {
  // region Helper-Properties für das Beispiel

  readonly showOutputEvents = signal(false);
  config: LuxComponentsConfigParameters;
  log = logResult;

  // endregion

  // region Properties der Component

  readonly label = signal('Beispiel-Link');
  readonly iconName = signal('lux-interface-link');
  readonly iconShowRight = signal(true);
  readonly disabled = signal(false);
  readonly blank = signal(true);
  readonly href = signal('https://www.ihk-gfi.de/');

  // endregion

  subscription: Subscription;

  private configService = inject(LuxComponentsConfigService);

  constructor() {
    this.config = this.configService.currentConfig;

    this.subscription = this.configService.config.subscribe((config: LuxComponentsConfigParameters) => {
      this.config = config;
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
    this.log(this.showOutputEvents(), 'luxClicked', event);
  }
}
