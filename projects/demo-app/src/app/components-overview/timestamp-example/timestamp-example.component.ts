import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import {
  LuxButtonComponent,
  LuxDatepickerComponent,
  LuxFormHintComponent,
  LuxInputComponent,
  LuxRelativeTimestampPipe,
  LuxUtil
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
  // Der Datepicker liefert einen Tag ohne Zeitzone ("yyyy-MM-dd"), das Beispiel nimmt Mitternacht dieses Tages.
  readonly initialDate = LuxUtil.todayAsLocalDate();
  readonly now = signal<number | null>(toTimestamp(this.initialDate));
  readonly nowISO = signal<string | null>(this.initialDate);

  readonly defaultText = signal('');
  readonly prefix = signal<string | undefined>(undefined);

  updateNow(date: string | null) {
    if (LuxUtil.isLocalDate(date)) {
      this.now.set(toTimestamp(date));
    }
  }

  resetNow() {
    this.now.set(toTimestamp(this.initialDate));
    this.nowISO.set(this.initialDate);
  }

  clearNow() {
    this.now.set(null);
    this.nowISO.set(null);
  }
}

/**
 * Der Zeitstempel von Mitternacht (lokale Zeit) eines Tages "yyyy-MM-dd".
 */
function toTimestamp(date: string): number {
  const [year, month, day] = date.substring(0, 10).split('-').map(Number);
  return new Date(year, month - 1, day).getTime();
}
