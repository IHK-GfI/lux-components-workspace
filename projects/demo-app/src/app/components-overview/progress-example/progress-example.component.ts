import { NgStyle } from '@angular/common';
import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import {
  LuxButtonComponent,
  LuxFormHintComponent,
  LuxInputAcComponent,
  LuxProgressColors,
  LuxProgressComponent,
  LuxProgressModeType,
  LuxProgressSizeType,
  LuxSelectAcComponent
} from '@ihk-gfi/lux-components';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';

@Component({
  selector: 'app-progress-example',
  templateUrl: './progress-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxProgressComponent,
    LuxButtonComponent,
    LuxSelectAcComponent,
    LuxInputAcComponent,
    LuxFormHintComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    NgStyle,
    ExampleBaseSimpleOptionsComponent
  ]
})
export class ProgressBarExampleComponent {
  sizes = ['small', 'medium', 'large'];
  colors = LuxProgressColors;
  readonly backgroundColor = signal('');
  modes = ['determinate', 'indeterminate'];

  readonly size = signal<LuxProgressSizeType>('medium');
  readonly mode = signal<LuxProgressModeType>('determinate');
  readonly value = signal(70);

  addBarProgress() {
    this.value.update((v) => (v + 10 > 100 ? 100 : v + 10));
  }

  subtractBarProgress() {
    this.value.update((v) => (v - 10 < 0 ? 0 : v - 10));
  }
}
