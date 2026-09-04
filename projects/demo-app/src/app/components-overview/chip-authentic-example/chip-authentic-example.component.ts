import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  LuxAccordionComponent,
  LuxAutofocusDirective,
  LuxChipComponent,
  LuxChipGroupComponent,
  LuxChipsComponent,
  LuxChipsOrientation,
  LuxFormHintComponent,
  LuxInputComponent,
  LuxPanelComponent,
  LuxPanelContentComponent,
  LuxPanelHeaderTitleComponent,
  LuxSelectComponent,
  LuxThemePalette,
  LuxToggleComponent
} from '@ihk-gfi/lux-components';
import { StatusMarkerComponent } from '../../base/status-marker/status-marker.component';
import { DemoMarkerType } from '../../base/status-marker/status-marker.model';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { logResult, setRequiredValidatorForFormControl } from '../../example-base/example-base-util/example-base-helper';

@Component({
  selector: 'lux-chip-authentic-example',
  templateUrl: './chip-authentic-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxAccordionComponent,
    LuxPanelHeaderTitleComponent,
    LuxPanelContentComponent,
    LuxPanelComponent,
    LuxToggleComponent,
    LuxSelectComponent,
    LuxInputComponent,
    LuxFormHintComponent,
    LuxChipsComponent,
    LuxChipGroupComponent,
    LuxChipComponent,
    LuxAutofocusDirective,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ReactiveFormsModule,
    ExampleBaseSimpleOptionsComponent,
    ExampleBaseAdvancedOptionsComponent,
    StatusMarkerComponent
  ]
})
export class ChipAuthenticExampleComponent {
  readonly showOutputEvents = signal(false);
  readonly log = logResult;
  readonly colors = ['Keine Farbe', 'warn', 'accent', 'primary'];
  readonly chips = signal<{ label: string; color: LuxThemePalette; removable: boolean; disabled: boolean }[]>([
    { label: 'Chip #1', color: undefined, removable: true, disabled: false },
    { label: 'Chip #2', color: 'primary', removable: true, disabled: false },
    { label: 'Chip #3', color: 'warn', removable: true, disabled: false },
    { label: 'Chip #4', color: 'accent', removable: true, disabled: false }
  ]);
  readonly openedPanel = signal(0);
  readonly longOptionLabel = 'Lorem ipsum dolor \n sit amet consectetur adipisicing elit.  ';
  readonly disabled = signal(false);
  readonly inputAllowed = signal(true);
  readonly inputLabel = signal('Neu');
  readonly placeholder = signal('eingeben oder auswählen');
  readonly chipOrientation = signal<LuxChipsOrientation>('horizontal');
  readonly autocomplete = signal(true);
  readonly autocompleteOptions = signal(this.createOptions());
  readonly autocompleteNoGroupAllOptions = ['Neuer Chip #1', 'Neuer Chip #2', 'Neuer Chip #3'];
  readonly autocompleteNoGroupOptions = signal([...this.autocompleteNoGroupAllOptions]);
  readonly optionBlockSize = signal(500);
  readonly strict = signal(false);
  readonly required = signal(false);
  readonly form = new FormGroup({
    names: new FormControl(null)
  });
  readonly controlBinding = 'names';
  readonly requiredValidatorFn = Validators.required;
  readonly groupRemovable = signal(true);
  readonly groupDisabled = signal(false);
  readonly groupColor = signal<LuxThemePalette | undefined>(undefined);
  readonly groupLabels = ['Group Chip #1', 'Group Chip #2', 'Group Chip #3'];
  readonly labelLongFormat = signal(false);
  readonly denseFormat = signal(false);
  readonly hideBorder = signal(false);
  readonly inputLabelAlwaysVisible = signal(false);
  readonly noTopLabel = signal(false);
  readonly noBottomLabel = signal(false);
  readonly noLabels = signal(false);
  readonly markerTypeUpdated = DemoMarkerType.Updated;

  chipAdded(newChip: string) {
    const add = !this.strict() || this.shouldAddChip(newChip);

    if (add) {
      this.chips.update((chips) => [...chips, { label: newChip, color: 'warn', removable: true, disabled: false }]);
      this.log(this.showOutputEvents(), `Der Chip "${newChip}" wurde hinzugefügt.`);

      this.updateChipOptions();
    } else {
      if (this.hasChip(newChip)) {
        this.log(this.showOutputEvents(), `Der Chip "${newChip}" ist bereits ausgewählt.`);
      } else {
        this.log(
          this.showOutputEvents(),
          `Der Chip "${newChip}" kann nicht hinzugefügt werden, da dieser nicht Teil der Optionen ist (siehe luxStrict).`
        );
      }
    }
  }

  chipRemoved(chipIndex: number) {
    this.chips.update((chips) => chips.filter((_chip, index) => index !== chipIndex));
    this.log(this.showOutputEvents(), `Der Chip "${chipIndex}" wurde entfernt.`);
    this.updateChipOptions();
  }

  changeRequired(required: boolean) {
    this.required.set(required);
    setRequiredValidatorForFormControl(required, this.form, this.controlBinding);
  }

  updateChip(chipIndex: number, changes: Partial<{ label: string; color: LuxThemePalette; removable: boolean; disabled: boolean }>) {
    this.chips.update((chips) => chips.map((chip, index) => (index === chipIndex ? { ...chip, ...changes } : chip)));
  }

  private hasChip(newChip: string): boolean {
    const selectedChips = this.chips().map((chip) => chip.label);

    return !!selectedChips.find((chip) => chip === newChip);
  }

  private shouldAddChip(newChip: string): boolean {
    const selectedChips = this.chips().map((chip) => chip.label);
    const found = this.autocomplete() ? !!this.autocompleteNoGroupAllOptions.find((option) => option === newChip) : true;
    const foundLabel = !!selectedChips.find((label) => label === newChip);

    return found && !foundLabel;
  }

  private updateChipOptions() {
    const selectedChips = this.chips().map((chip) => chip.label);
    this.autocompleteNoGroupOptions.set(this.autocompleteNoGroupAllOptions.filter((option) => !selectedChips.includes(option)));
  }

  private createOptions() {
    const options = ['Neuer Chip #1', 'Neuer Chip #2', 'Neuer Chip #3', this.longOptionLabel];

    for (let i = 0; i < 20000; i++) {
      options.push('Chip #' + `${i}`.padStart(5, '0'));
    }

    return options;
  }
}
