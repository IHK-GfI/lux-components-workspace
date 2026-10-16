import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  LuxBadgeColors,
  LuxBadgeComponent,
  LuxBadgeSize,
  LuxFormHintComponent,
  LuxInputComponent,
  LuxLabelComponent,
  LuxSelectComponent,
  LuxToggleComponent
} from '@ihk-gfi/lux-components';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';

@Component({
  selector: 'app-badge-example',
  templateUrl: './badge-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxBadgeComponent,
    LuxLabelComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent,
    LuxFormHintComponent,
    LuxInputComponent,
    LuxToggleComponent,
    LuxSelectComponent,
    NgStyle
  ]
})
export class BadgeExampleComponent {
  readonly colors = LuxBadgeColors;
  readonly iconName = signal('lux-interface-arrows-left-circle-1');
  readonly text = signal('Badge');
  readonly uppercase = signal(false);
  readonly muted = signal(false);
  readonly size = signal<LuxBadgeSize>('');
  readonly backgroundColor = signal('');

  readonly sizeOptions: { label: string; value: LuxBadgeSize }[] = [
    { label: 'Standard (erbt vom Parent)', value: '' },
    { label: 'Small (12px)', value: 'small' },
    { label: 'Medium (16px)', value: 'medium' },
    { label: 'Large (20px)', value: 'large' }
  ];
  readonly sizePickValue = (option: { label: string; value: LuxBadgeSize }) => option.value;
}
