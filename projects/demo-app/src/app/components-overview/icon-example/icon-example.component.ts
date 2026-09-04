import { NgStyle } from '@angular/common';
import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import {
  LuxCheckboxComponent,
  LuxFormHintComponent,
  LuxIconColor,
  LuxIconColors,
  LuxIconComponent,
  LuxIconRegistryService,
  LuxInputComponent,
  LuxLinkPlainComponent,
  LuxSelectComponent
} from '@ihk-gfi/lux-components';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';

@Component({
  selector: 'app-icon-example',
  templateUrl: './icon-example.component.html',
  styleUrls: ['./icon-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxIconComponent,
    LuxLinkPlainComponent,
    LuxSelectComponent,
    LuxInputComponent,
    LuxFormHintComponent,
    LuxCheckboxComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    NgStyle,
    ExampleBaseSimpleOptionsComponent,
    ExampleBaseAdvancedOptionsComponent
  ]
})
export class IconExampleComponent {
  colors: LuxIconColor[] = LuxIconColors;
  iconSizes: string[] = ['1x', '2x', '3x', '4x', '5x', '55px', '121px', '1.7em'];
  readonly iconName = signal('lux-interface-favorite-like-1');
  iconHint = 'Beispiele: app-box, app-ihk-189, lux-save,...';
  readonly iconSize = signal('2x');
  readonly rounded = signal(false);
  readonly margin = signal('');
  readonly padding = signal('4px');
  readonly backgroundColor = signal('');

  private iconService = inject(LuxIconRegistryService);

  constructor() {
    this.registerIcon('app-box', '/', '/assets/svg/box.svg');
    this.registerIcon('app-ihk-189', 'https://cdn.gfi.ihk.de/IHK-Logos/', '189_kurz.svg');
  }

  registerIcon(iconName: string, iconBasePath: string, iconPath: string) {
    if (!this.iconService.getSvgIconList().some((item) => item.iconName === iconName)) {
      this.iconService.getSvgIconList().push({ iconName, iconBasePath, iconPath });
    }
  }
}
