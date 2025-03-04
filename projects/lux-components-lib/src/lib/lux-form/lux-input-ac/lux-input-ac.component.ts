import { NgClass } from '@angular/common';
import { Component, ContentChild, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { LuxAriaDescribedbyDirective } from '../../../lib/lux-directives/lux-aria/lux-aria-describedby.directive';
import { LuxTagIdDirective } from '../../../lib/lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxFormControlWrapperComponent } from '../lux-form-control-wrapper/lux-form-control-wrapper.component';
import { LuxMaxLengthDirective } from '../lux-form-control/lux-form-directives/lux-maxlength/lux-max-length.directive';
import { LuxNameDirectiveDirective } from '../lux-form-control/lux-form-directives/lux-name/lux-name-directive.directive';
import { LuxFormInputBaseClass } from '../lux-form-model/lux-form-input-base.class';
import { LuxInputAcPrefixComponent } from '../lux-input-ac/lux-input-ac-subcomponents/lux-input-ac-prefix.component';
import { LuxInputAcSuffixComponent } from '../lux-input-ac/lux-input-ac-subcomponents/lux-input-ac-suffix.component';

@Component({
  selector: 'lux-input-ac',
  templateUrl: './lux-input-ac.component.html',
  styleUrls: ['./lux-input-ac.component.scss'],
  imports: [
    LuxFormControlWrapperComponent,
    FormsModule,
    ReactiveFormsModule,
    MatPrefix,
    MatInput,
    LuxNameDirectiveDirective,
    LuxMaxLengthDirective,
    NgClass,
    MatSuffix,
    LuxTagIdDirective,
    LuxAriaDescribedbyDirective
  ]
})
export class LuxInputAcComponent<T = string> extends LuxFormInputBaseClass<T> implements OnInit {
  private readonly symbolRegExp = /[,.]/;

  @Input() luxType = 'text';
  @Input() luxNumberAlignLeft = false;
  @Input() luxNoLabels = false;
  @Input() luxNoTopLabel = false;
  @Input() luxNoBottomLabel = false;
  @Input() luxHideCounterLabel = false;

  @Input() set luxMaxLength(maxLength: number) {
    this._luxMaxLength = maxLength;
    if (this.formControl) {
      //erst nach ngOnInit() vorhanden
      this.updateCounterLabel();
    }
  }

  get luxMaxLength() {
    return this._luxMaxLength;
  }

  @ContentChild(LuxInputAcPrefixComponent) inputPrefix?: LuxInputAcPrefixComponent;
  @ContentChild(LuxInputAcSuffixComponent) inputSuffix?: LuxInputAcSuffixComponent;
  @ViewChild('input', { read: ElementRef }) inputElement!: ElementRef;

  counterLabel = '';
  focused = false;
  _luxMaxLength = 0;

  override ngOnInit() {
    super.ngOnInit();
    this.updateCounterLabel();
  }

  /**
   * Wird bei jedem Tastendruck auf dem Inputfeld aufgerufen.
   * @param keyboardEvent
   */
  onKeyDown(keyboardEvent: KeyboardEvent) {
    // Soll nur für number-Inputs greifen
    if (this.inputElement) {
      const value = this.inputElement.nativeElement.value;
      // Doppelte Punkt-/Komma-Setzung und E's vermeiden
      if (
        value &&
        this.symbolRegExp.test(keyboardEvent.key) &&
        (this.inputElement.nativeElement.value.match(this.symbolRegExp) || []).length > 0
      ) {
        keyboardEvent.preventDefault();
      }
    }
  }

  onFocus(e: FocusEvent) {
    this.focused = true;
    this.luxFocus.emit(e);
  }

  onFocusIn(e: FocusEvent) {
    this.focused = true;
    this.luxFocusIn.emit(e);
  }

  onFocusOut(e: FocusEvent) {
    this.focused = false;
    this.luxFocusOut.emit(e);
  }

  descripedBy() {
    if (this.errorMessage) {
      return this.uid + '-error';
    } else {
      return (this.formHintComponent || this.luxHint) && (!this.luxHintShowOnlyOnFocus || (this.luxHintShowOnlyOnFocus && this.focused))
        ? this.uid + '-hint'
        : undefined;
    }
  }

  override notifyFormValueChanged(formValue: any) {
    this.updateCounterLabel();
    super.notifyFormValueChanged(formValue);
  }

  private updateCounterLabel() {
    if (this.luxMaxLength > 0 && this.luxType === 'text') {
      if (typeof this.formControl.value === 'string') {
        this.counterLabel = this.formControl.value.length + '/' + this.luxMaxLength;
      } else {
        this.counterLabel = '0/' + this.luxMaxLength;
      }
    } else {
      this.counterLabel = '';
    }
  }
}
