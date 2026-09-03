import { Directive, input, output } from '@angular/core';
import { LuxFormComponentBase } from './lux-form-component-base.class';

/**
 * Basis-Klasse für FormComponents, die einen ähnlichen Grundaufbau für das Eintippen von String-Daten haben
 * (Input und Textarea z.B.).
 */
@Directive()
export abstract class LuxFormInputBaseClass<T = any> extends LuxFormComponentBase<T> {
  readonly luxPlaceholder = input('');
  readonly luxTagId = input<string | undefined>(undefined);
  readonly luxName = input<string | undefined>(undefined);
  readonly luxAutocomplete = input('on');

  /**
   * Der von außen gesetzte Wert. Die Quelle der Wahrheit bleibt das FormControl; den aktuellen
   * Wert liefern das Signal value() bzw. getValue().
   */
  readonly luxValue = input<T>(null as T);

  readonly luxBlur = output<FocusEvent>();
  readonly luxFocus = output<FocusEvent>();
  readonly luxValueChange = output<T>();

  constructor() {
    super();

    this.syncValueInputToFormControl(this.luxValue);
  }

  override ngOnInit() {
    // Den gebundenen Startwert übernehmen, bevor das FormControl initialisiert wird. Dadurch
    // löst der Initialwert - wie bisher - noch kein luxValueChange aus.
    this._initialValue = this.luxValue();

    super.ngOnInit();
  }

  override notifyFormValueChanged(formValue: any) {
    // Aktualisierungen an dem FormControl-Value sollen auch nach außen bekannt gemacht werden.
    this.luxValueChange.emit(formValue);
  }
}
