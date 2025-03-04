import { Component } from '@angular/core';
import {
  LuxIconComponent,
  LuxInputAcComponent,
  LuxSelectAcComponent,
  LuxTextareaAcComponent,
  LuxTextboxColor,
  LuxTextboxComponent
} from 'lux-components-lib';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';

@Component({
  selector: 'lux-textbox-example',
  templateUrl: './textbox-example.component.html',
  styleUrls: ['./textbox-example.component.scss'],
  imports: [
    LuxIconComponent,
    LuxTextboxComponent,
    LuxTextareaAcComponent,
    LuxSelectAcComponent,
    LuxInputAcComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent
  ]
})
export class TextboxExampleComponent {
  title = 'Information';
  content = `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo itaque accusamus facere labore mollitia at aut nesciunt fugiat, sequi quos, quo quibusdam tempora provident veniam sunt distinctio. Aliquid, magnam dolore.`;
  color: LuxTextboxColor | undefined;
  icon = 'lux-interface-alert-information-circle';
  heading = 2;

  colorOptions = [
    { label: 'default', value: '' },
    { label: 'blue', value: 'blue' },
    { label: 'green', value: 'green' },
    { label: 'yellow', value: 'yellow' },
    { label: 'red', value: 'red' }
  ];

  constructor() {
    this.color = 'blue';
  }

  onColorChanged(_color: { label: string; value: LuxTextboxColor }) {
    this.color = _color.value;
  }
}
