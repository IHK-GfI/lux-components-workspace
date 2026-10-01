import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import {
  LuxIconComponent,
  LuxInputComponent,
  LuxSelectComponent,
  LuxTextareaComponent,
  LuxTextboxColor,
  LuxTextboxComponent
} from '@ihk-gfi/lux-components';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';

@Component({
  selector: 'lux-textbox-example',
  templateUrl: './textbox-example.component.html',
  styleUrls: ['./textbox-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxIconComponent,
    LuxTextboxComponent,
    LuxTextareaComponent,
    LuxSelectComponent,
    LuxInputComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent
  ]
})
export class TextboxExampleComponent {
  readonly title = signal('Information');
  readonly content = signal(
    `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo itaque accusamus facere labore mollitia at aut nesciunt fugiat, sequi quos, quo quibusdam tempora provident veniam sunt distinctio. Aliquid, magnam dolore.`
  );
  readonly color = signal<LuxTextboxColor | undefined>('blue');
  readonly icon = signal('lux-interface-alert-information-circle');
  readonly heading = signal(2);

  colorOptions = [
    { label: 'default', value: '' },
    { label: 'blue', value: 'blue' },
    { label: 'green', value: 'green' },
    { label: 'yellow', value: 'yellow' },
    { label: 'red', value: 'red' }
  ];

  onColorChanged(_color: { label: string; value: LuxTextboxColor }) {
    this.color.set(_color.value);
  }
}
