import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormField, form, maxLength, minLength, required, submit } from '@angular/forms/signals';
import { LUX_FORMS_COMPAT, LuxButtonComponent, LuxCheckboxComponent, LuxInputComponent, LuxTileComponent } from '@ihk-gfi/lux-components';

/**
 * Zeigt die vier Bindungsarten, die eine LUX-FormComponent nach der Umstellung auf den
 * Signal-Forms-Vertrag unterstützt - alle mit derselben, unveränderten Komponente.
 */
@Component({
  selector: 'app-binding-modes-example',
  templateUrl: './binding-modes-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxInputComponent,
    LuxCheckboxComponent,
    LuxButtonComponent,
    LuxTileComponent,
    FormField,
    ReactiveFormsModule,
    ...LUX_FORMS_COMPAT
  ]
})
export class BindingModesExampleComponent {
  // 1. Signal Form - der empfohlene Weg.
  readonly signalModel = signal({ name: '', eula: false });
  readonly signalForm = form(this.signalModel, (path) => {
    required(path.name, { message: 'Bitte einen Namen eingeben' });
    minLength(path.name, 3);
    maxLength(path.name, 20);
  });
  readonly submitCount = signal(0);

  // 2. Freistehend, ohne jedes Formular.
  readonly plainName = signal('Anna');
  readonly plainEula = signal(false);
  readonly plainDisabled = signal(false);

  // 3. Klassische Reactive Forms (Alt-Pfad über die ControlValueAccessor-Brücke).
  readonly reactiveForm = new FormGroup({
    name: new FormControl('Berta', [Validators.required, Validators.minLength(3)]),
    eula: new FormControl(false, Validators.requiredTrue)
  });

  // 4. Die bisherige LUX-API (luxControlBinding). Unverändert lauffähig.
  readonly luxForm = new FormGroup({
    name: new FormControl('Cäsar', [Validators.required, Validators.minLength(3)])
  });

  readonly signalFormState = computed(() => {
    const state = this.signalForm();
    return JSON.stringify({ value: state.value(), valid: state.valid(), touched: state.touched() }, null, 2);
  });

  onSubmitSignalForm() {
    submit(this.signalForm, async () => {
      this.submitCount.update((count) => count + 1);
    });
  }

  onMarkReactiveTouched() {
    this.reactiveForm.markAllAsTouched();
  }

  onToggleReactiveDisabled() {
    if (this.reactiveForm.disabled) {
      this.reactiveForm.enable();
    } else {
      this.reactiveForm.disable();
    }
  }
}
