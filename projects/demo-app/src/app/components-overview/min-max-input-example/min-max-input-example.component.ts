import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LuxInputAcComponent, LuxSelectAcComponent, LuxToggleAcComponent } from '@ihk-gfi/lux-components';
import { LuxMinMaxBounds, LuxMinMaxInputComponent, LuxMinMaxValue } from '@ihk-gfi/lux-components/lux-min-max-input';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { logResult } from '../../example-base/example-base-util/example-base-helper';
import { ExampleFormDisableComponent } from '../../example-base/example-form-disable/example-form-disable.component';
import { ExampleFormValueComponent } from '../../example-base/example-form-value/example-form-value.component';
import { ExampleValueComponent } from '../../example-base/example-value/example-value.component';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

/** Verschiebt einen ISO-Kalendertag (UTC-Mitternacht) um die angegebene Anzahl Tage. */
const addDays = (iso: string, days: number): string => new Date(Date.parse(iso) + days * DAY_IN_MS).toISOString();

@Component({
  selector: 'app-min-max-input-example',
  templateUrl: './min-max-input-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    LuxMinMaxInputComponent,
    LuxInputAcComponent,
    LuxSelectAcComponent,
    LuxToggleAcComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent,
    ExampleBaseAdvancedOptionsComponent,
    ExampleFormDisableComponent,
    ExampleFormValueComponent,
    ExampleValueComponent
  ]
})
export class MinMaxInputExampleComponent {
  log = logResult;

  readonly stepOptions: { label: string; value: number }[] = [
    { label: '1', value: 1 },
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '0.5', value: 0.5 }
  ];

  readonly controlBinding = 'mitarbeitende';
  readonly form = new FormGroup({
    mitarbeitende: new FormControl<LuxMinMaxValue<number>>({ min: 10, max: 50 }, { nonNullable: true })
  });

  showOutputEvents = signal(false);
  label = signal('Mitarbeitende');
  minLabel = signal('');
  maxLabel = signal('');
  unit = signal('');
  step = signal(1);
  boundsMin = signal<number | null>(0);
  boundsMax = signal<number | null>(null);
  disabled = signal(false);
  limitToWeek = signal(true);

  numberValue = signal<LuxMinMaxValue<number>>({});
  dateValue = signal<LuxMinMaxValue<string>>({});

  numberBounds = computed<LuxMinMaxBounds<number>>(() => {
    const bounds: LuxMinMaxBounds<number> = {};
    const min = this.boundsMin();
    const max = this.boundsMax();
    if (min !== null && min !== undefined) {
      bounds.min = min;
    }
    if (max !== null && max !== undefined) {
      bounds.max = max;
    }
    return bounds;
  });

  // Wertabhängige Grenze: Bis liegt höchstens 7 Tage nach Von. Rechnet die Anwendung, nicht die Komponente.
  // Ein Bis außerhalb der neuen Grenze fällt aus dem Wert und wird wieder übernommen, sobald es gültig ist.
  dateMaxFieldBounds = computed<LuxMinMaxBounds<string> | undefined>(() => {
    const von = this.dateValue().min;
    if (!this.limitToWeek() || !von) {
      return undefined;
    }
    return { min: von, max: addDays(von, 7) };
  });
}
