import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  LuxCardComponent,
  LuxCardContentComponent,
  LuxCheckboxAcComponent,
  LuxInputAcComponent,
  LuxRadioAcComponent,
  LuxSelectAcComponent
} from '@ihk-gfi/lux-components';
import { LuxConditionalDirective } from '@ihk-gfi/lux-components/lux-conditional';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';

@Component({
  selector: 'app-conditional-example',
  templateUrl: './conditional-example.component.html',
  styleUrls: ['./conditional-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxCardComponent,
    LuxCardContentComponent,
    LuxCheckboxAcComponent,
    LuxConditionalDirective,
    LuxInputAcComponent,
    LuxRadioAcComponent,
    LuxSelectAcComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent
  ]
})
export class ConditionalExampleComponent {
  protected readonly employmentOptions = ['Angestellt', 'Selbstständig', 'Keine Angabe'];
  protected readonly employment = signal<string>('Keine Angabe');
  protected readonly differentBillingAddress = signal(false);
  protected readonly departmentOptions = [
    'Kundenservice und Beratung',
    'Rechnungswesen und Controlling',
    'Marketing und Kommunikation',
    'Personal und Organisation'
  ];
  protected readonly showDepartments = signal(false);
  // Vorbelegt mit drei langen Einträgen, damit der Inhalt breiter als die Spalte wäre.
  protected readonly departments = signal<string[]>(this.departmentOptions.slice(0, 3));

  protected readonly isEmployed = computed(() => this.employment() === 'Angestellt');
  protected readonly isSelfEmployed = computed(() => this.employment() === 'Selbstständig');
}
