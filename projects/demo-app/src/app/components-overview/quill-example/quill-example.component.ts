import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { disabled, form, FormField, readonly, required } from '@angular/forms/signals';
import { LuxInputComponent, LuxSelectComponent, LuxToggleComponent } from '@ihk-gfi/lux-components';
import { LuxHtmlComponent } from '@ihk-gfi/lux-components/lux-html';
import {
  LUX_QUILL_DEFAULT_TOOLBAR,
  LuxQuillComponent,
  LuxQuillConfig,
  LuxQuillHeadingLevel,
  LuxQuillHeadingMode,
  LuxQuillPreset,
  LuxQuillToolbarItem
} from '@ihk-gfi/lux-components/lux-quill';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { logResult } from '../../example-base/example-base-util/example-base-helper';
import { ExampleFormDisableComponent } from '../../example-base/example-form-disable/example-form-disable.component';
import { ExampleFormValueComponent } from '../../example-base/example-form-value/example-form-value.component';
import { ExampleSignalFormValueComponent } from '../../example-base/example-signal-form-value/example-signal-form-value.component';
import { ExampleValueComponent } from '../../example-base/example-value/example-value.component';

const START_VALUE =
  '<p>Sehr geehrte Damen und Herren,</p><p>vielen Dank für Ihre Anfrage. Weitere Informationen finden Sie unter ' +
  '<a href="https://www.ihk.de" rel="noopener noreferrer" target="_blank">www.ihk.de</a>.</p>' +
  '<ul><li>Punkt eins</li><li>Punkt zwei</li></ul>';

@Component({
  selector: 'app-quill-example',
  templateUrl: './quill-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    LuxQuillComponent,
    LuxHtmlComponent,
    LuxInputComponent,
    LuxSelectComponent,
    LuxToggleComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent,
    ExampleBaseAdvancedOptionsComponent,
    ExampleFormDisableComponent,
    ExampleFormValueComponent,
    ExampleSignalFormValueComponent,
    ExampleValueComponent,
    FormField
  ]
})
export class QuillExampleComponent {
  log = logResult;

  readonly presetOptions: { label: string; value: LuxQuillPreset }[] = [
    { label: 'comment (Kommentar)', value: 'comment' },
    { label: 'document (Dokument)', value: 'document' }
  ];

  // 'preset' statt null: lux-select wertet null als "nichts ausgewählt" und zeigt dann keinen Text an.
  readonly headingModeOptions: { label: string; value: LuxQuillHeadingMode | 'preset' }[] = [
    { label: 'Wie im Preset', value: 'preset' },
    { label: 'none', value: 'none' },
    { label: 'visual', value: 'visual' },
    { label: 'semantic', value: 'semantic' }
  ];

  readonly headingLevelOptions: { label: string; value: string }[] = [
    { label: 'h1 / h2', value: '1,2' },
    { label: 'h2 / h3', value: '2,3' },
    { label: 'h3 / h4', value: '3,4' },
    { label: 'h4 / h5', value: '4,5' },
    { label: 'h5 / h6', value: '5,6' }
  ];

  readonly toolbarOptions: LuxQuillToolbarItem[] = [...LUX_QUILL_DEFAULT_TOOLBAR];

  // 1. Signal Form - der empfohlene Weg.
  readonly signalModel = signal({ quillValue: START_VALUE });
  readonly signalForm = form(this.signalModel, (path) => {
    disabled(path.quillValue, { when: () => this.disabled() });
    readonly(path.quillValue, { when: () => this.readonly() });
    required(path.quillValue, { when: () => this.required() });
  });

  // 2. Reactive Form.
  readonly controlBinding = 'quillExample';
  readonly form = new FormGroup({
    quillExample: new FormControl<string>(START_VALUE, { nonNullable: true })
  });

  readonly showOutputEvents = signal(false);
  readonly preset = signal<LuxQuillPreset>('document');
  readonly headingMode = signal<LuxQuillHeadingMode | 'preset'>('preset');
  readonly headingLevels = signal('1,2');
  readonly toolbar = signal<LuxQuillToolbarItem[]>([...LUX_QUILL_DEFAULT_TOOLBAR]);
  readonly label = signal('Nachricht');
  readonly hint = signal('Optionaler Zusatztext');
  readonly placeholder = signal('Text eingeben');
  readonly errorMessage = signal('');
  readonly minHeight = signal('8rem');
  readonly maxHeight = signal('20rem');
  readonly required = signal(false);
  readonly readonly = signal(false);
  readonly disabled = signal(false);
  readonly dense = signal(false);
  readonly noTopLabel = signal(false);
  readonly noBottomLabel = signal(false);

  readonly value = signal(START_VALUE);

  readonly config = computed<Partial<LuxQuillConfig>>(() => {
    const [level1, level2] = this.headingLevels().split(',').map(Number) as LuxQuillHeadingLevel[];
    const config: Partial<LuxQuillConfig> = { headingLevels: [level1, level2], toolbar: this.toolbar() };
    const headingMode = this.headingMode();
    if (headingMode !== 'preset') {
      config.headingMode = headingMode;
    }
    return config;
  });

  constructor() {
    effect(() => {
      const control = this.form.controls.quillExample;
      control.setValidators(this.required() ? Validators.required : null);
      control.updateValueAndValidity();
    });
  }
}
