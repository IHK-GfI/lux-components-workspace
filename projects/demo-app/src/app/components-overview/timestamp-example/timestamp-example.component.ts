import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import {
  LuxButtonComponent,
  LuxDatepickerComponent,
  LuxFormHintComponent,
  LuxInputComponent,
  LuxRelativeTimestampPipe
} from '@ihk-gfi/lux-components';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';

@Component({
  selector: 'app-timestamp-example',
  templateUrl: './timestamp-example.component.html',
  styleUrls: ['./timestamp-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxRelativeTimestampPipe,
    LuxButtonComponent,
    LuxInputComponent,
    LuxFormHintComponent,
    LuxDatepickerComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent
  ]
})
export class TimestampExampleComponent {
  readonly initialNow = Date.now();
  readonly now = signal<number | null>(this.initialNow);
  readonly nowISO = signal(new Date(this.initialNow).toISOString());

  readonly defaultText = signal('');
  readonly prefix = signal<string | undefined>(undefined);

  updateNow(timestamp: string) {
    if (timestamp) {
      const now = new Date(timestamp).getTime();
      this.now.set(now);
      this.nowISO.set(new Date(now).toISOString());
    }
  }

  resetNow() {
    this.now.set(this.initialNow);
    this.nowISO.set(new Date(this.initialNow).toISOString());
  }

  clearNow() {
    this.now.set(null);
    this.nowISO.set('');
  }
}
