import { NgStyle } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  LuxCheckboxAcComponent,
  LuxFormHintComponent,
  LuxIconColor,
  LuxIconColors,
  LuxIconComponent,
  LuxIconRegistryService,
  LuxInputAcComponent,
  LuxLinkPlainComponent,
  LuxSelectAcComponent
} from '@ihk-gfi/lux-components';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';

@Component({
  selector: 'app-icon-example',
  templateUrl: './icon-example.component.html',
  styleUrls: ['./icon-example.component.scss'],
  imports: [
    LuxIconComponent,
    LuxLinkPlainComponent,
    LuxSelectAcComponent,
    LuxInputAcComponent,
    LuxFormHintComponent,
    LuxCheckboxAcComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    NgStyle,
    ExampleBaseSimpleOptionsComponent,
    ExampleBaseAdvancedOptionsComponent
  ]
})
export class IconExampleComponent {
  private iconService = inject(LuxIconRegistryService);

  colors: LuxIconColor[] = LuxIconColors;
  iconSizes: string[] = ['1x', '2x', '3x', '4x', '5x', '55px', '121px', '1.7em'];
  iconName = 'lux-interface-favorite-like-1';
  iconHint = 'Beispiele: app-box, app-ihk-gfi, lux-save,...';
  iconSize = '2x';
  rounded = false;
  margin = '';
  padding = '4px';
  backgroundColor = '';

  constructor() {
    this.iconService.getSvgIconList().push({ iconName: 'app-box', iconBasePath: '/', iconPath: '/assets/svg/box.svg' });
    this.iconService.getSvgIconList().push({ iconName: 'app-ihk-gfi', iconBasePath: '/', iconPath: '/assets/svg/IHK_GfI.svg' });
  }
}
