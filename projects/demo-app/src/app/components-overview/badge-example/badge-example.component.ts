import { NgStyle } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  LuxBadgeColors,
  LuxBadgeComponent,
  LuxBadgeSize,
  LuxFormHintComponent,
  LuxInputAcComponent,
  LuxLabelComponent,
  LuxSelectAcComponent,
  LuxToggleAcComponent
} from '@ihk-gfi/lux-components';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';

@Component({
  selector: 'app-badge-example',
  templateUrl: './badge-example.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    LuxBadgeComponent,
    LuxLabelComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent,
    LuxFormHintComponent,
    LuxInputAcComponent,
    LuxToggleAcComponent,
    LuxSelectAcComponent,
    NgStyle
  ]
})
export class BadgeExampleComponent {
  colors = LuxBadgeColors;
  iconName = 'lux-interface-arrows-left-circle-1';
  text = 'Badge';
  uppercase = false;
  muted = false;
  size: LuxBadgeSize = '';
  backgroundColor = '';

  sizeOptions: { label: string; value: LuxBadgeSize }[] = [
    { label: 'Standard (erbt vom Parent)', value: '' },
    { label: 'Small (12px)', value: 'small' },
    { label: 'Medium (16px)', value: 'medium' },
    { label: 'Large (20px)', value: 'large' }
  ];
  sizePickValue = (option: { label: string; value: LuxBadgeSize }) => option.value;

  constructor() {}
}
