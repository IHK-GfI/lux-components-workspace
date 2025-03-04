import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { LuxAriaDescribedbyDirective } from '../../lux-directives/lux-aria/lux-aria-describedby.directive';
import { LuxTagIdDirective } from '../../lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxFormControlWrapperComponent } from '../lux-form-control-wrapper/lux-form-control-wrapper.component';
import { LuxMaxLengthDirective } from '../lux-form-control/lux-form-directives/lux-maxlength/lux-max-length.directive';
import { LuxNameDirectiveDirective } from '../lux-form-control/lux-form-directives/lux-name/lux-name-directive.directive';
import { LuxFormInputBaseClass } from '../lux-form-model/lux-form-input-base.class';

@Component({
  selector: 'lux-textarea-ac',
  templateUrl: './lux-textarea-ac.component.html',
  styleUrls: [],
  imports: [
    LuxFormControlWrapperComponent,
    FormsModule,
    ReactiveFormsModule,
    MatInput,
    CdkTextareaAutosize,
    LuxNameDirectiveDirective,
    LuxMaxLengthDirective,
    LuxTagIdDirective,
    LuxAriaDescribedbyDirective
  ]
})
export class LuxTextareaAcComponent<T = string> extends LuxFormInputBaseClass<T> implements OnInit {
  @Input() luxMaxRows = -1;
  @Input() luxMinRows = 0;
  @Input() luxNoLabels = false;
  @Input() luxNoTopLabel = false;
  @Input() luxNoBottomLabel = false;
  @Input() luxHideCounterLabel = false;
  @Input() set luxMaxLength(maxLength: number) {
    this._luxMaxLength = maxLength;
    if (this.formControl) {
      // Erst nach ngOnInit() vorhanden
      this.updateCounterLabel();
    }
  }
  get luxMaxLength() {
    return this._luxMaxLength;
  }

  focused = false;
  counterLabel = '';
  _luxMaxLength = 0;

  override ngOnInit() {
    super.ngOnInit();
    this.updateCounterLabel();
  }

  override notifyFormValueChanged(formValue: any) {
    this.updateCounterLabel();
    super.notifyFormValueChanged(formValue);
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

  private updateCounterLabel() {
    if (this.luxMaxLength > 0) {
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
