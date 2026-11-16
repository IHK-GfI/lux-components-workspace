import { NgStyle } from '@angular/common';
import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import {
  LuxButtonComponent,
  LuxFormHintComponent,
  LuxInputComponent,
  LuxProgressColors,
  LuxProgressComponent,
  LuxProgressModeType,
  LuxProgressSizeType,
  LuxProgressTextPositionType,
  LuxSelectComponent,
  LuxToggleComponent
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
    LuxSelectComponent,
    LuxToggleComponent,
    LuxInputComponent,
    LuxFormHintComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    NgStyle,
    ExampleBaseSimpleOptionsComponent
  ]
})
export class ProgressBarExampleComponent {
  readonly sizes = ['small', 'medium', 'large'];
  readonly colors = LuxProgressColors;
  readonly backgroundColor = signal('');
  readonly modes = ['determinate', 'indeterminate'];
  readonly textPositions: LuxProgressTextPositionType[] = ['bottom', 'left', 'top'];

  readonly size = signal<LuxProgressSizeType>('medium');
  readonly mode = signal<LuxProgressModeType>('determinate');
  readonly value = signal(70);
  readonly muted = signal(false);
  readonly showText = signal(false);
  readonly text = signal('');
  readonly textPosition = signal<LuxProgressTextPositionType>('bottom');

  addBarProgress() {
    this.value.update((v) => (v + 10 > 100 ? 100 : v + 10));
  }

  subtractBarProgress() {
    this.value.update((v) => (v - 10 < 0 ? 0 : v - 10));
  }
}
