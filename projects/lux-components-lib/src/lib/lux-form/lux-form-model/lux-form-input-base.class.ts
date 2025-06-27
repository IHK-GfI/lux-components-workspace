import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { LuxFormComponentBase } from './lux-form-component-base.class';

/**
 * Basis-Klasse für FormComponents, die einen ähnlichen Grundaufbau für das Eintippen von String-Daten haben
 * (Input und Textarea z.B.).
 */
@Directive()
export abstract class LuxFormInputBaseClass<T = any> extends LuxFormComponentBase<T> {
  @Output() luxValueChange = new EventEmitter<T>();
  @Output() luxBlur = new EventEmitter<FocusEvent>();
  @Output() luxFocus = new EventEmitter<FocusEvent>();

  @Input() luxPlaceholder = '';
  @Input() luxTagId?: string;
  @Input() luxName?: string;
  @Input() luxAutocomplete = 'on';

  get luxValue(): T {
    return this.getValue();
  }

  @Input() set luxValue(value: T) {
    this.setValue(value);
  }

  override notifyFormValueChanged(formValue: any) {
    // Aktualisierungen an dem FormControl-Value sollen auch via EventEmitter bekannt gemacht werden
    this.luxValueChange.emit(formValue);
  }
}
