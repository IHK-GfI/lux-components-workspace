import { Component } from '@angular/core';
import {
    LuxButtonComponent,
    LuxDatepickerAcComponent,
    LuxFormHintComponent,
    LuxInputAcComponent,
    LuxRelativeTimestampPipe
} from '@ihk-gfi/lux-components';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';

@Component({
  selector: 'app-timestamp-example',
  templateUrl: './timestamp-example.component.html',
  styleUrls: ['./timestamp-example.component.scss'],
  imports: [
    LuxRelativeTimestampPipe,
    LuxButtonComponent,
    LuxInputAcComponent,
    LuxFormHintComponent,
    LuxDatepickerAcComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent
  ]
})
export class TimestampExampleComponent {
  readonly initialNow = Date.now();
  now: number | null;
  nowISO: string;

  defaultText = '';
  prefix?: string;
  relativeUntilMin?: number;
  relativeUntilMax?: number;

  constructor() {
    this.now = this.initialNow;
    this.nowISO = new Date(this.now).toISOString();
  }

  updateNow(timestamp: string) {
    if (timestamp) {
      this.now = new Date(timestamp).getTime();
      this.nowISO = new Date(this.now).toISOString();
    }
  }

  resetNow() {
    this.now = this.initialNow;
    this.nowISO = new Date(this.now).toISOString();
  }

  clearNow() {
    this.now = null;
    this.nowISO = '';
  }
}
